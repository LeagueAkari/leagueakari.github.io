// 支持 League Akari 1.5.2

const POSITION_NAMES = {
  TOP: '上路',
  JUNGLE: '打野',
  MIDDLE: '中路',
  BOTTOM: '下路',
  UTILITY: '辅助'
}

function getMessages(ctx) {
  const { target } = ctx.options
  const { manager } = ctx.runtime
  const ongoingGame = manager.getInstance('ongoing-game-main')
  const leagueClient = manager.getInstance('league-client-main')

  if (!ongoingGame || !leagueClient) return []

  const state = ongoingGame.state
  if (state.queryStage.gameInfo?.queueType === 'CHERRY') return []

  const selfPuuid = state.draft?.puuid || leagueClient.data.summoner.me?.puuid || null
  const players = selectTargetPlayers(target, state.teams, selfPuuid)

  return players.map(({ puuid, side }) => {
    const summoner = state.summoner?.[puuid]
    const playerName = summoner?.gameName || summoner?.displayName || '未知玩家'
    const championId = state.championSelections?.[puuid] || 0
    const championName = championId > 0 ? leagueClient.data.gameData.championName(championId) : '未选英雄'
    const position = state.positionAssignments?.[puuid]?.position || 'NONE'
    const positionName = POSITION_NAMES[position] || '未知分路'

    return `${side} · ${playerName} · ${championName} · ${positionName}`
  })
}

function selectTargetPlayers(target, teams, selfPuuid) {
  const entries = Object.entries(teams || {}).filter(
    ([teamId, members]) => teamId !== 'TEAM-ALL' && Array.isArray(members) && members.length > 0
  )
  const selfTeam = selfPuuid ? entries.find(([, members]) => members.includes(selfPuuid)) : null

  let friendly
  let enemies

  if (selfTeam) {
    friendly = selfTeam
    enemies = entries.filter(([teamId]) => teamId !== selfTeam[0])
  } else {
    const blue = entries.find(([teamId]) => teamId === 'TEAM-100')
    const red = entries.find(([teamId]) => teamId === 'TEAM-200')
    if (!blue || !red) return []
    friendly = blue
    enemies = [red]
  }

  const selected =
    target === 'friendly'
      ? [{ team: friendly, side: '我方' }]
      : target === 'enemy'
        ? enemies.map((team) => ({ team, side: '敌方' }))
        : [
            { team: friendly, side: selfTeam ? '我方' : '蓝方' },
            ...enemies.map((team) => ({ team, side: selfTeam ? '敌方' : '红方' }))
          ]

  return selected.flatMap(({ team, side }) => team[1].map((puuid) => ({ puuid, side })))
}
