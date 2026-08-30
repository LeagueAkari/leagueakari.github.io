// 支持 League Akari 1.5.2

function getMessages(ctx) {
  const { target } = ctx.options
  const { manager } = ctx.runtime
  const ongoingGame = manager.getInstance('ongoing-game-main')
  const leagueClient = manager.getInstance('league-client-main')

  if (!ongoingGame || !leagueClient || target !== 'all') return []

  const state = ongoingGame.state
  const isArena = state.queryStage.gameInfo?.queueType === 'CHERRY'
  const members = state.teams?.['TEAM-ALL']
  if (!isArena || !Array.isArray(members) || !members.length) return []

  return [...new Set(members)].map((puuid) => {
    const summoner = state.summoner?.[puuid]
    const playerName = summoner?.gameName || summoner?.displayName || '未知玩家'
    const championId = state.championSelections?.[puuid] || 0
    const championName = championId > 0 ? leagueClient.data.gameData.championName(championId) : '未选英雄'

    return `斗魂竞技场 · ${playerName} · ${championName}`
  })
}
