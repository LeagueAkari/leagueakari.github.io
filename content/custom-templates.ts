export interface CustomTemplateSource {
  label: string
  url: string
  detail: string
}

export interface CustomTemplateExample {
  slug: string
  title: string
  shortTitle: string
  summary: string
  mode: string
  supportedVersion: '1.5.2'
  difficulty: '入门' | '进阶'
  fileName: string
  expectedOutput: string[]
  behavior: string[]
  limitations: string[]
  sources: CustomTemplateSource[]
}

const prophetCommit = 'e81d7b8eb9748414acf10967cf8966f0ed73ce70'

export const CUSTOM_TEMPLATE_EXAMPLES: CustomTemplateExample[] = [
  {
    slug: 'horse-score',
    title: '马说：对局评分',
    shortTitle: '马说评分',
    summary: '读取已加载的近期战绩，按 lol 对局先知的公开规则计算每位玩家的综合分与“上等马”等评级。',
    mode: '匹配模式 / 单双排 / 灵活排位 / 极地大乱斗',
    supportedVersion: '1.5.2',
    difficulty: '进阶',
    fileName: 'horse-score.js',
    expectedOutput: ['上等马 赤座灯里 评分 132.6，样本 18 场', '小代 吉川千夏 评分 151.3，样本 20 场'],
    behavior: [
      '按原算法的 100 基础分、里程碑、队内排名、贡献占比、补刀与 KDA 修正计算单场得分。',
      '最近 5 小时的有效对局占 80% 权重，其余对局占 20%。',
      '助攻贡献按原项目公开计分文档使用助攻次数判断；原 Go 实现当前对应分支使用击杀次数，此处按文档语义修正。',
      '只使用已缓存且满足队列与时长条件的最近战绩；没有有效样本时明确提示。'
    ],
    limitations: [
      '这是第三方娱乐性评分，不代表 League Akari、Riot Games 或玩家的真实水平评价。',
      '当前版本不适用于斗魂竞技场、海克斯大乱斗，以及人机或其他合作玩法；不同数据源缺少字段时会跳过相应对局。',
      '模板采用原项目当前默认配置；原项目可以通过服务端配置改变权重，未来可能再次变化。'
    ],
    sources: [
      {
        label: '原始算法实现：hh-lol-prophet/app.go',
        url: `https://github.com/real-web-world/hh-lol-prophet/blob/${prophetCommit}/app.go`,
        detail: '算法来自 real-web-world/hh-lol-prophet（MIT）；此永久链接固定到核对时的 e81d7b8 提交。'
      },
      {
        label: '原始默认计分配置',
        url: `https://github.com/real-web-world/hh-lol-prophet/blob/${prophetCommit}/global/global.go`,
        detail: '基础分、队列、时长、排名、贡献、补刀、KDA 修正与评级门槛均以这里的当前默认配置为依据。'
      },
      {
        label: '原项目网站',
        url: 'https://lol.buffge.com',
        detail: 'hh-lol-prophet 仓库声明的项目网站；模板页面不会代理或复制该站内容。'
      }
    ]
  },
  {
    slug: 'classic-roster',
    title: '经典模式阵容清单',
    shortTitle: '阵容清单',
    summary: '按阵营输出玩家、当前英雄和分路，适合草稿预览、选人阶段与进入游戏后的快速确认。',
    mode: '经典双队模式',
    supportedVersion: '1.5.2',
    difficulty: '入门',
    fileName: 'classic-roster.js',
    expectedOutput: ['我方 · 岁纳京子 · 阿狸 · 中路', '我方 · 船见结衣 · 锐雯 · 上路'],
    behavior: [
      '支持真实对局与 League Akari 的手动草稿预览。',
      '正常对局按当前账号识别阵营；草稿没有视角玩家时使用蓝方 / 红方回退。',
      '玩家名、英雄或分路尚不可用时使用简短占位，不输出内部标识符。'
    ],
    limitations: ['不分析战绩，也不会主动补载玩家信息。', '不适用于当前无法区分双方阵营的斗魂竞技场对局。'],
    sources: []
  },
  {
    slug: 'arena-roster',
    title: '斗魂竞技场全员清单',
    shortTitle: '斗魂竞技场全员',
    summary: '在当前斗魂竞技场对局或相应草稿中，通过“全体”目标列出所有可见玩家与英雄。',
    mode: '斗魂竞技场',
    supportedVersion: '1.5.2',
    difficulty: '入门',
    fileName: 'arena-roster.js',
    expectedOutput: ['斗魂竞技场 · 赤座灯里 · 佐伊', '斗魂竞技场 · 吉川千夏 · 萨勒芬妮'],
    behavior: [
      '只有选择“全体”时才会生成内容。',
      '同时支持当前斗魂竞技场状态与手动创建的斗魂竞技场草稿。',
      '逐行输出，避免一条消息包含过多玩家。'
    ],
    limitations: [
      '当前运行时无法可靠确定斗魂竞技场的小队归属，因此“我方”和“敌方”都会返回空结果。',
      '只展示当前可见的玩家与英雄，不推测增幅选择。'
    ],
    sources: []
  }
]

export function getCustomTemplateExample(slug: string) {
  return CUSTOM_TEMPLATE_EXAMPLES.find((template) => template.slug === slug)
}
