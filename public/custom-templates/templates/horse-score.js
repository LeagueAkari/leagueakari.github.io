// 支持 League Akari 1.5.2
// 评分算法来源：real-web-world/hh-lol-prophet（MIT）
// 核对版本：https://github.com/real-web-world/hh-lol-prophet/tree/e81d7b8eb9748414acf10967cf8966f0ed73ce70

const BASE_SCORE = 100
const RECENT_WINDOW_HOURS = 5
const RECENT_WEIGHT = 0.8
const OLD_WEIGHT = 0.2
const MIN_GAME_DURATION_SECONDS = 15 * 60

// 此模板只支持经典双队模式。原项目默认配置还包含 1700，League Akari 版本有意排除斗魂竞技场。
const ALLOWED_QUEUE_IDS = new Set([420, 430, 440, 450])

const GRADE_THRESHOLDS = [
  [180, '通天代'],
  [150, '小代'],
  [125, '上等马'],
  [105, '中等马'],
  [95, '下等马']
]

const RANKING_SCORE = [10, 5, 0, -5, -10]

const KILL_CONTRIBUTION = [
  {
    share: 0.5,
    scores: [
      [15, 40],
      [10, 20],
      [5, 10]
    ]
  },
  {
    share: 0.4,
    scores: [
      [15, 20],
      [10, 10],
      [5, 5]
    ]
  }
]

const DAMAGE_CONTRIBUTION = [
  {
    share: 0.4,
    scores: [
      [15, 40],
      [10, 20],
      [5, 10]
    ]
  },
  {
    share: 0.3,
    scores: [
      [15, 20],
      [10, 10],
      [5, 5]
    ]
  }
]

const ASSIST_CONTRIBUTION = [
  {
    share: 0.5,
    scores: [
      [20, 30],
      [18, 25],
      [15, 20],
      [10, 10],
      [5, 5]
    ]
  },
  {
    share: 0.4,
    scores: [
      [20, 15],
      [15, 10],
      [10, 5],
      [5, 3]
    ]
  }
]

function getMessages(ctx) {
  const { target } = ctx.options
  const { manager } = ctx.runtime
  const ongoingGame = manager.getInstance('ongoing-game-main')
  const leagueClient = manager.getInstance('league-client-main')

  if (!ongoingGame || !leagueClient) return []

  const state = ongoingGame.state
  const currentQueueId = state.queryStage.gameInfo?.queueId
  if (!ALLOWED_QUEUE_IDS.has(currentQueueId)) return []

  const selfPuuid = state.draft?.puuid || leagueClient.data.summoner.me?.puuid || null
  const members = selectTargetMembers(target, state.teams, selfPuuid)

  return members.map((puuid) => {
    const history = state.matchHistory?.[puuid]?.data || []
    const scores = history.flatMap((gameSummary) => {
      const game = extractGame(puuid, gameSummary)
      return game ? [{ score: calculateGameScore(game), isRecent: game.isRecent }] : []
    })
    const display = playerDisplayName(puuid, state, leagueClient.data.gameData)

    if (!scores.length) return `${display} 近期无有效对局`

    const score = mergeScores(scores)
    return `${gradeName(score)} ${display} 评分 ${score.toFixed(1)}，样本 ${scores.length} 场`
  })
}

function extractGame(puuid, gameSummary) {
  if (!gameSummary?.data) return null

  const source = gameSummary.source
  const root = source === 'lcu' ? gameSummary.data : source === 'sgp' ? gameSummary.data.json : null
  if (!root) return null

  const queueId = Number(root.queueId)
  const gameDuration = Number(root.gameDuration) || 0
  if (!ALLOWED_QUEUE_IDS.has(queueId) || gameDuration < MIN_GAME_DURATION_SECONDS) return null

  let participant
  let teammates

  if (source === 'lcu') {
    const participantId = root.participantIdentities?.find(
      (identity) => identity.player?.puuid === puuid
    )?.participantId
    if (!participantId) return null

    participant = root.participants?.find((item) => item.participantId === participantId)
    if (!participant) return null
    teammates = root.participants.filter((item) => item.teamId === participant.teamId)
  } else {
    participant = root.participants?.find((item) => item.puuid === puuid)
    if (!participant) return null
    teammates = root.participants.filter((item) => item.teamId === participant.teamId)
  }

  if (!teammates?.length) return null

  const statsOf = (item) => (source === 'lcu' ? item.stats : item)
  const stats = statsOf(participant)
  if (!stats) return null

  const teamKills = sumBy(teammates, (item) => statsOf(item).kills)
  const teamDamage = sumBy(teammates, (item) => statsOf(item).totalDamageDealtToChampions)
  const teamAssists = sumBy(teammates, (item) => statsOf(item).assists)

  const kills = number(stats.kills)
  const deaths = number(stats.deaths)
  const assists = number(stats.assists)
  const killParticipation = (kills + assists) / noZero(teamKills)
  const gameCreation = Number(root.gameCreation) || 0

  return {
    isRecent: Date.now() - gameCreation < RECENT_WINDOW_HOURS * 60 * 60 * 1000,
    isSupport:
      source === 'lcu'
        ? participant.timeline?.lane === 'BOTTOM' && participant.timeline?.role === 'DUO_SUPPORT'
        : participant.teamPosition === 'UTILITY',
    firstBloodKill: Boolean(stats.firstBloodKill),
    firstBloodAssist: Boolean(stats.firstBloodAssist),
    tripleKills: number(stats.tripleKills),
    quadraKills: number(stats.quadraKills),
    pentaKills: number(stats.pentaKills),
    kills,
    deaths,
    assists,
    killParticipation,
    killParticipationRank: rankBy(
      teammates,
      (item) => {
        const itemStats = statsOf(item)
        return (number(itemStats.kills) + number(itemStats.assists)) / noZero(teamKills)
      },
      participant
    ),
    goldRank: rankBy(teammates, (item) => number(statsOf(item).goldEarned), participant),
    damageRank: rankBy(teammates, (item) => number(statsOf(item).totalDamageDealtToChampions), participant),
    damageGoldRank: rankBy(
      teammates,
      (item) => number(statsOf(item).totalDamageDealtToChampions) / noZero(number(statsOf(item).goldEarned)),
      participant
    ),
    visionRank: rankBy(teammates, (item) => number(statsOf(item).visionScore), participant),
    killShare: kills / noZero(teamKills),
    damageShare: number(stats.totalDamageDealtToChampions) / noZero(teamDamage),
    assistShare: assists / noZero(teamAssists),
    csPerMinute: (number(stats.totalMinionsKilled) + number(stats.neutralMinionsKilled)) / noZero(gameDuration / 60)
  }
}

function calculateGameScore(game) {
  let score = BASE_SCORE

  if (game.firstBloodKill) score += 10
  else if (game.firstBloodAssist) score += 5

  if (game.pentaKills > 0) score += 20
  else if (game.quadraKills > 0) score += 10
  else if (game.tripleKills > 0) score += 5

  score += RANKING_SCORE[game.killParticipationRank - 1] || 0

  if (game.goldRank <= 2 || !game.isSupport) {
    score += RANKING_SCORE[game.goldRank - 1] || 0
  }

  if (game.damageRank <= 2) score += RANKING_SCORE[game.damageRank - 1] || 0
  if (game.damageGoldRank <= 2) score += RANKING_SCORE[game.damageGoldRank - 1] || 0
  if (game.visionRank <= 2) score += RANKING_SCORE[game.visionRank - 1] || 0

  score += contributionBonus(game.killShare, game.kills, KILL_CONTRIBUTION)
  score += contributionBonus(game.damageShare, game.kills, DAMAGE_CONTRIBUTION)
  score += contributionBonus(game.assistShare, game.assists, ASSIST_CONTRIBUTION)

  if (game.csPerMinute >= 10) score += 20
  else if (game.csPerMinute >= 9) score += 10
  else if (game.csPerMinute >= 8) score += 5

  const kda = (game.kills + game.assists) / noZero(game.deaths)
  score += (kda - 2 + (game.kills - game.deaths) / 5) * game.killParticipation

  return score
}

function contributionBonus(share, value, rules) {
  for (const rule of rules) {
    if (share <= rule.share) continue
    for (const [threshold, bonus] of rule.scores) {
      if (value > threshold) return bonus
    }
    return 0
  }
  return 0
}

function rankBy(teammates, valueOf, participant) {
  const value = valueOf(participant)
  return 1 + teammates.filter((item) => item !== participant && valueOf(item) > value).length
}

function mergeScores(items) {
  const allAverage = average(items.map((item) => item.score))
  const recent = items.filter((item) => item.isRecent).map((item) => item.score)
  const old = items.filter((item) => !item.isRecent).map((item) => item.score)
  const recentAverage = recent.length ? average(recent) : allAverage
  const oldAverage = old.length ? average(old) : allAverage
  return recentAverage * RECENT_WEIGHT + oldAverage * OLD_WEIGHT
}

function gradeName(score) {
  return GRADE_THRESHOLDS.find(([threshold]) => score >= threshold)?.[1] || '牛马'
}

function average(values) {
  return values.reduce((total, value) => total + value, 0) / noZero(values.length)
}

function sumBy(values, pick) {
  return values.reduce((total, value) => total + number(pick(value)), 0)
}

function number(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0
}

function noZero(value) {
  return value === 0 ? 1 : value
}

function selectTargetMembers(target, teams, selfPuuid) {
  const entries = Object.entries(teams || {}).filter(
    ([teamId, members]) => teamId !== 'TEAM-ALL' && Array.isArray(members) && members.length > 0
  )
  const selfTeam = selfPuuid ? entries.find(([, members]) => members.includes(selfPuuid)) : null

  if (selfTeam) {
    const friendly = selfTeam[1]
    const enemy = entries.filter(([teamId]) => teamId !== selfTeam[0]).flatMap(([, members]) => members)
    return uniqueTarget(target, friendly, enemy)
  }

  const blue = entries.find(([teamId]) => teamId === 'TEAM-100')?.[1] || []
  const red = entries.find(([teamId]) => teamId === 'TEAM-200')?.[1] || []
  if (!blue.length || !red.length) return []
  return uniqueTarget(target, blue, red)
}

function uniqueTarget(target, friendly, enemy) {
  const selected = target === 'friendly' ? friendly : target === 'enemy' ? enemy : [...friendly, ...enemy]
  return [...new Set(selected)]
}

function playerDisplayName(puuid, state, gameData) {
  const championId = state.championSelections?.[puuid] || 0
  const championName = championId > 0 ? gameData.championName(championId) : ''
  const summoner = state.summoner?.[puuid]
  const playerName = summoner?.gameName || summoner?.displayName || ''
  const riotId = playerName && summoner?.tagLine ? `${playerName}#${summoner.tagLine}` : playerName
  const phase = state.queryStage.phase

  return phase === 'champ-select' || phase === 'lobby'
    ? riotId || championName || '未知玩家'
    : championName || riotId || '未知玩家'
}
