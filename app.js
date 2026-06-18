(() => {
const app = document.getElementById("app");
const STORE = "empirical-lab-progress-v1";
const THEME_KEY = "empirical-lab-theme";

function getTheme() { return localStorage.getItem(THEME_KEY) || "dark"; }
function setTheme(theme) {
  if (document.documentElement) document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  if (typeof document.querySelector === "function") {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#0A0A0A" : "#F4F4F0";
  }
}
function toggleTheme() { setTheme(getTheme() === "dark" ? "light" : "dark"); render(); }
setTheme(getTheme());

const LANG_KEY = "empirical-lab-lang";
function getLang() { return localStorage.getItem(LANG_KEY) || "en"; }
function setLang(lang) { localStorage.setItem(LANG_KEY, lang); if (document.documentElement) document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en"); }
function toggleLang() { setLang(getLang() === "en" ? "zh" : "en"); render(); }
setLang(getLang());

const i18n = {
  // Nav & chrome
  "home": { en: "Home", zh: "首页" },
  "quest_map": { en: "Quest Map", zh: "任务地图" },
  "skill_tree": { en: "Skill Tree", zh: "技能树" },
  "notes": { en: "Notes", zh: "笔记" },
  "glossary": { en: "Glossary", zh: "术语表" },
  "toolkit": { en: "Toolkit", zh: "工具箱" },
  "profile": { en: "Profile", zh: "档案" },
  "next": { en: "Next", zh: "下一个" },
  "open": { en: "Open", zh: "打开" },
  "start": { en: "Start", zh: "开始" },
  "locked": { en: "Locked", zh: "未解锁" },
  "review": { en: "Review", zh: "复习" },
  "back": { en: "Back", zh: "返回" },
  "submit": { en: "Submit", zh: "提交" },
  "submit_memo": { en: "Submit Memo", zh: "提交备忘录" },
  "run_static_check": { en: "Run Static Check", zh: "运行静态检查" },
  "check_order": { en: "Check Order", zh: "检查顺序" },
  "reset": { en: "Reset", zh: "重置" },
  "collect_xp": { en: "Collect XP", zh: "领取经验" },
  "continue": { en: "Continue", zh: "继续" },
  "complete": { en: "Complete", zh: "完成" },
  "in_progress": { en: "In progress", zh: "进行中" },
  "newly_unlocked": { en: "Newly unlocked", zh: "新解锁" },
  "start_here": { en: "Start here", zh: "从这里开始" },
  "levels": { en: "Levels", zh: "关卡" },
  "boss_projects": { en: "Boss Projects", zh: "Boss 项目" },
  "method_notes": { en: "Method Notes", zh: "方法笔记" },
  "mvp_time": { en: "MVP time", zh: "总时长" },
  "remaining": { en: "Remaining", zh: "剩余" },
  "next_level": { en: "Next level", zh: "下一关" },
  "done": { en: "Done", zh: "完成" },
  "xp": { en: "XP", zh: "经验值" },
  "streak": { en: "Streak", zh: "连续天数" },
  // Section titles
  "title_quest_map": { en: "/// Quest Map", zh: "/// 任务地图" },
  "title_skill_tree": { en: "[ Skill Tree ]", zh: "[ 技能树 ]" },
  "title_method_notes": { en: "--- Method Notes", zh: "--- 方法笔记" },
  "title_glossary": { en: "{.} Glossary", zh: "{.} 术语表" },
  "title_toolkit": { en: "[::] Toolkit", zh: "[::] 工具箱" },
  "title_profile": { en: ">>> Profile", zh: ">>> 档案" },
  "title_mvp_questlines": { en: "/// MVP Questlines", zh: "/// MVP 任务线" },
  // Section subtitles
  "sub_quest_map": { en: "Choose a research arc.", zh: "选择一条研究路线。" },
  "sub_skill_tree": { en: "Mastery grows as you clear tagged levels.", zh: "通关标记关卡来提升掌握度。" },
  "sub_method_notes": { en: "Short theory cards for empirical work.", zh: "实证研究的理论速查卡。" },
  "sub_glossary": { en: "Fast definitions for empirical economics terms used in the quests.", zh: "任务中出现的实证经济学术语速查。" },
  "sub_toolkit": { en: "Package quick reference, not language basics.", zh: "工具包速查，非语言基础。" },
  // Home
  "hero_title": { en: "Game-based empirical economics training", zh: "游戏化实证经济学训练" },
  "hero_desc": { en: "Built for economics master's students who already know basic R/Python and want to master causal inference, econometrics packages, data acquisition, and reproducible research workflows.", zh: "面向已掌握基础 R/Python 的经济学硕士生，训练因果推断、计量包、数据获取和可复现研究流程。" },
  "start_first_quest": { en: "Start Your First Research Quest", zh: "开始你的第一个研究任务" },
  "continue_research": { en: "Continue Research Quest", zh: "继续研究任务" },
  "view_completed": { en: "View Completed Profile", zh: "查看完成档案" },
  "view_quest_map": { en: "View Quest Map", zh: "查看任务地图" },
  "session_cue": { en: "Session cue", zh: "本次提示" },
  "rank_progress": { en: "Rank progress", zh: "等级进度" },
  "pipeline_progress": { en: "Pipeline progress", zh: "流程进度" },
  "focus_skill": { en: "Focus skill", zh: "聚焦技能" },
  "quest_progress": { en: "Quest progress", zh: "任务进度" },
  "concept_mastery": { en: "Concept mastery", zh: "概念掌握" },
  "open_profile": { en: "Open Profile", zh: "打开档案" },
  "levels_completed": { en: "levels completed", zh: "关卡已完成" },
  // Quest
  "open_quest": { en: "Open Quest", zh: "打开任务" },
  "back_to_quest": { en: "Back to Quest", zh: "返回任务" },
  "learning_pathway": { en: "Learning pathway", zh: "学习路径" },
  "next_study_block": { en: "Next study block", zh: "下一学习时段" },
  "progress_snapshot": { en: "Progress Snapshot", zh: "进度快照" },
  "boss_ladder": { en: "Boss ladder", zh: "Boss 阶梯" },
  "boss_target": { en: "Boss target", zh: "Boss 目标" },
  "method_reminder": { en: "Method reminder", zh: "方法提醒" },
  "research_checklist": { en: "Research checklist", zh: "研究清单" },
  "why_this_quest": { en: "Why this quest", zh: "为何做此任务" },
  "next_up": { en: "Next up", zh: "接下来" },
  "quest_complete": { en: "Quest complete. Review any level or continue to the next quest.", zh: "任务完成。可复习任意关卡或继续下一任务。" },
  // Level
  "story": { en: "Story", zh: "情境" },
  "concept_note": { en: "Concept Note", zh: "概念笔记" },
  "challenge": { en: "Challenge", zh: "挑战" },
  "reward": { en: "Reward", zh: "奖励" },
  "suggested_pace": { en: "Suggested pace", zh: "建议用时" },
  "related_notes": { en: "Related Method Notes", zh: "相关方法笔记" },
  "quest": { en: "Quest", zh: "任务" },
  "review_mode": { en: "Review mode", zh: "复习模式" },
  "xp_already_earned": { en: "XP already earned.", zh: "经验已获得。" },
  "quick_method_note": { en: "Quick method note", zh: "方法速记" },
  "common_pitfall": { en: "Common pitfall", zh: "常见陷阱" },
  "ask_yourself": { en: "Ask yourself", zh: "自问" },
  "memo_checklist": { en: "Memo checklist", zh: "备忘录清单" },
  // Profile
  "reset_progress": { en: "Reset MVP Progress", zh: "重置 MVP 进度" },
  "daily_streak": { en: "Daily streak", zh: "连续天数" },
  "completed_levels": { en: "Completed levels", zh: "完成关卡" },
  "next_recommended": { en: "Next recommended level", zh: "推荐下一关" },
  "all_completed": { en: "All MVP levels completed.", zh: "所有 MVP 关卡已完成。" },
  "skill_focus": { en: "Skill focus", zh: "技能聚焦" },
  "badges": { en: "Badges", zh: "徽章" },
  "rank_ladder": { en: "Rank ladder", zh: "等级阶梯" },
  "research_artifacts": { en: "Research artifacts", zh: "研究成果" },
  "mastery_transcript": { en: "Mastery transcript", zh: "掌握证明" },
  "progress_backup": { en: "Progress Backup", zh: "进度备份" },
  "export_progress": { en: "Export Progress", zh: "导出进度" },
  "import_progress": { en: "Import Progress", zh: "导入进度" },
  // Misc
  "method_first": { en: "Method first, package second", zh: "方法先行，工具跟进" },
  "selected_order_none": { en: "Selected order: none", zh: "已选顺序：无" },
  "method_tool_map": { en: "Method → tool map", zh: "方法 → 工具对照" },
  "code_recipes": { en: "Code recipes", zh: "代码模板" },
  "mvp_complete": { en: "MVP complete", zh: "MVP 完成" },
  "footer": { en: "[ SYS ] EMPIRICAL-LAB v0.1 /// FE + DID + EVENT STUDY + PLAYWRIGHT", zh: "[ SYS ] 实证实验室 v0.1 /// FE + DID + 事件研究 + PLAYWRIGHT" },
  // Rank names
  "rank_1": { en: "Level 1 · New Research Assistant", zh: "等级 1 · 新研究助理" },
  "rank_2": { en: "Level 2 · Data Cleaner", zh: "等级 2 · 数据清洗员" },
  "rank_3": { en: "Level 3 · Regression Runner", zh: "等级 3 · 回归跑手" },
  "rank_4": { en: "Level 4 · Causal Apprentice", zh: "等级 4 · 因果学徒" },
  "rank_5": { en: "Level 5 · Junior Empirical Economist", zh: "等级 5 · 初级实证经济学者" },
  // Challenge type labels
  "type_mcq": { en: "Concept Check", zh: "概念检验" },
  "type_fill": { en: "Calculation", zh: "计算" },
  "type_code": { en: "Code Challenge", zh: "代码挑战" },
  "type_memo": { en: "Research Memo", zh: "研究备忘录" },
  "type_ordering": { en: "Workflow Order", zh: "流程排序" },
  "type_default": { en: "Challenge", zh: "挑战" },
  // Quest prerequisites
  "prereq_did": { en: "Complete Fixed Effects Lab Boss", zh: "完成固定效应实验室 Boss" },
  "prereq_data": { en: "Complete DID & Event Study Boss", zh: "完成 DID 与事件研究 Boss" },
  "prereq_final": { en: "Complete all three quest bosses", zh: "完成所有三条任务线 Boss" },
  "prereq_did_full": { en: "Complete the Fixed Effects Lab boss.", zh: "完成固定效应实验室 Boss" },
  "prereq_data_full": { en: "Complete the DID & Event Study boss.", zh: "完成 DID 与事件研究 Boss" },
  "prereq_final_full": { en: "Complete all three questline bosses.", zh: "完成所有三条任务线 Boss" },
  // Quest outcomes
  "outcome_fe": { en: "Output: firm-year regression memo", zh: "产出：企业年度回归备忘录" },
  "outcome_did": { en: "Output: policy evaluation memo", zh: "产出：政策评估备忘录" },
  "outcome_data": { en: "Output: city-year dataset plan", zh: "产出：城市年度数据集方案" },
  "outcome_final": { en: "Output: full causal estimate memo", zh: "产出：完整因果估计备忘录" },
  "outcome_default": { en: "Output: research artifact", zh: "产出：研究成果" },
  // Status tags
  "tag_newly_unlocked": { en: "Newly unlocked", zh: "新解锁" },
  "tag_complete": { en: "Complete", zh: "已完成" },
  "tag_in_progress": { en: "In progress", zh: "进行中" },
  "tag_start_here": { en: "Start here", zh: "从这里开始" },
  // Quest method reminders
  "reminder_fe": { en: "Start with panel structure: define unit-time keys before adding fixed effects or clustered inference.", zh: "从面板结构开始：先定义单位-时间键，再添加固定效应和聚类推断。" },
  "reminder_did": { en: "Build from fixed effects: treatment varies by unit-time. Check parallel trends before trusting the DID coefficient.", zh: "从固定效应出发：处理变量随单位-时间变化。先验证平行趋势再信任DID系数。" },
  "reminder_data": { en: "API first, static HTML second, browser automation last. Save raw sources and validate panel merge keys.", zh: "API优先，静态HTML其次，浏览器自动化最后。保存原始数据并验证面板合并键。" },
  "reminder_final": { en: "Complete the research arc: raw data → panel keys → causal assumption → estimate → diagnose → memo.", zh: "完成研究弧线：原始数据→面板键→因果假设→估计→诊断→备忘录。" },
  // Quest contexts
  "context_did": { en: "You now have panel FE foundations. DID adds policy timing and counterfactual trends.", zh: "你已有面板固定效应基础。DID增加政策时机和反事实趋势。" },
  "context_data": { en: "You now understand causal identification. Data acquisition should serve a research design, not the other way around.", zh: "你已理解因果识别。数据获取应服务于研究设计，而非相反。" },
  "context_final": { en: "All workflows are unlocked. Now combine design, data, estimates, diagnostics, and communication.", zh: "所有流程已解锁。现在组合设计、数据、估计、诊断和沟通。" },
  // Home session hints
  "hint_start": { en: "Start with unit-time keys: panel design comes before estimation.", zh: "从单位-时间键开始：面板设计先于估计。" },
  "hint_quest_complete": { en: "Quest complete. Next quest unlocked: ", zh: "任务完成。下一个任务已解锁：" },
  "hint_all_boss_complete": { en: "All boss projects complete. Use review mode to revisit your research artifacts.", zh: "所有Boss项目完成。使用复习模式回顾你的研究成果。" },
  "hint_continue": { en: "Continue your current quest: ", zh: "继续当前任务：" },
  "hint_all_levels_complete": { en: "All MVP levels complete. Review your mastery transcript.", zh: "所有MVP关卡完成。查看你的掌握证明。" },
  // XP progress summary
  "xp_session_max": { en: "Session XP: +", zh: "本次经验：+" },
  "xp_max_rank": { en: " · Max MVP rank reached", zh: " · 已达MVP最高等级" },
  "xp_to": { en: " XP to ", zh: " 经验距 " },
  "xp_session_separator": { en: " · ", zh: " · 距 " },
  // Focus skill callout
  "focus_all_complete": { en: "All concept areas are complete for this MVP.", zh: "所有概念领域在此MVP中已完成。" },
  "focus_lagging": { en: "lagging—prioritize this", zh: "落后——优先提升" },
  "focus_ahead": { en: "ahead of schedule", zh: "领先进度" },
  "focus_on_pace": { en: "on pace", zh: "正常节奏" },
  "focus_unlock_next": { en: "Unlock the next related quest to continue.", zh: "解锁下一个相关任务以继续。" },
  "focus_practice_next": { en: "Practice next: ", zh: "下一练习：" },
  // Learning pathway
  "pathway_desc": { en: "Empirical work is sequential: design first, then identification, then data acquisition, then communication.", zh: "实证研究是有序的：先设计，再识别，再数据获取，最后沟通。" },
  "pathway_locked": { en: " · locked", zh: " · 未解锁" },
  // Study plan
  "study_all_complete": { en: "All MVP levels are complete. Use review mode or export your progress.", zh: "所有MVP关卡已完成。使用复习模式或导出进度。" },
  "study_desc": { en: "A focused 30-minute plan based on your current unlocks.", zh: "基于当前解锁状态的30分钟专注计划。" },
  "study_block_reward": { en: "Block reward:", zh: "时段奖励：" },
  "study_estimated_block": { en: "Estimated block:", zh: "预计用时：" },
  // Progress snapshot
  "snapshot_desc": { en: "Your current position in the empirical research pipeline.", zh: "你在实证研究流程中的当前位置。" },
  // Boss ladder
  "boss_ladder_desc": { en: "Clear these projects to prove each stage of empirical workflow mastery.", zh: "通关这些项目以证明每个阶段的实证工作流掌握程度。" },
  // Pace labels
  "pace_0_min": { en: "0 min", zh: "0 分钟" },
  "pace_min": { en: "min", zh: "分钟" },
  "pace_hrs": { en: "hrs", zh: "小时" },
  "pace_min_total": { en: "min total", zh: "分钟(总计)" },
  "pace_0_min_remaining": { en: "0 min remaining", zh: "0 分钟(剩余)" },
  "pace_min_remaining": { en: "min remaining", zh: "分钟(剩余)" },
  // Level unlock hint
  "unlock_by": { en: "Unlock by completing: ", zh: "通关以下关卡解锁：" },
  // Quest detail view
  "quest_next_up": { en: "Next up:", zh: "接下来：" },
  "quest_method_reminder": { en: "Method reminder:", zh: "方法提醒：" },
  "quest_boss_target": { en: "Boss target:", zh: "Boss目标：" },
  "quest_estimated_time": { en: "Estimated time:", zh: "预计时间：" },
  "quest_levels_to_boss": { en: "level(s) to boss", zh: "关卡距Boss" },
  "quest_back": { en: "Back", zh: "返回" },
  // Related note cards
  "note_quick_method": { en: "Quick method note", zh: "方法速记" },
  "note_common_pitfall": { en: "Common pitfall:", zh: "常见陷阱：" },
  "note_ask_yourself": { en: "Ask yourself:", zh: "自问：" },
  // Completed challenge summary
  "correct_answer": { en: "Correct answer: ", zh: "正确答案：" },
  "accepted_answer": { en: "Accepted answer: ", zh: "接受的答案：" },
  "completed_ordering": { en: "Completed workflow order. Review the sequence below.", zh: "流程排序已完成。查看以下顺序。" },
  "completed_memo": { en: "Completed memo. ", zh: "备忘录已完成。" },
  "review_mode_label": { en: "Review mode:", zh: "复习模式：" },
  "xp_already_earned_inline": { en: "XP already earned.", zh: "经验已获得。" },
  // Ordering challenge
  "selected_order_none_full": { en: "Selected order: none", zh: "已选顺序：无" },
  "selected_order_prefix": { en: "Selected order: ", zh: "已选顺序：" },
  // Error/feedback messages
  "ordering_wrong": { en: "Not quite. Start with data provenance, then panel construction, identification, diagnostics, estimation, and communication.", zh: "不太对。从数据来源开始，然后面板构建、识别、诊断、估计和沟通。" },
  "mcq_wrong_prefix": { en: "Not quite. Review: ", zh: "不太对。复习：" },
  "mcq_wrong_suffix": { en: " Try again.", zh: " 再试一次。" },
  "code_fill_blanks": { en: "Fill every blank before running the static check.", zh: "填完所有空白再运行静态检查。" },
  "code_missing_token": { en: "Missing required idea/token: ", zh: "缺少必要概念/关键词：" },
  "code_close_but_wrong": { en: "The code is close, but the filled blanks are not in the expected place.", zh: "代码接近了，但填空位置不对。" },
  "memo_too_long": { en: "Memo is too long for this MVP. Keep it under 5,000 characters.", zh: "备忘录太长了。请控制在5000字符以内。" },
  "memo_needs": { en: "Memo needs ", zh: "备忘录需要" },
  "memo_chars_and_ideas": { en: "+ characters and these ideas: ", zh: "+字符并包含以下概念：" },
  // Profile view
  "profile_xp": { en: "XP: ", zh: "经验：" },
  "profile_rank_progress": { en: "Rank progress:", zh: "等级进度：" },
  "profile_completed_levels": { en: "Completed levels: ", zh: "完成关卡：" },
  "profile_daily_streak": { en: "Daily streak: ", zh: "连续天数：" },
  "profile_next_recommended": { en: "Next recommended level: ", zh: "推荐下一关：" },
  "profile_all_completed": { en: "All MVP levels completed.", zh: "所有MVP关卡已完成。" },
  "profile_skill_focus": { en: "Skill focus:", zh: "技能聚焦：" },
  "profile_continue": { en: "Continue", zh: "继续" },
  "profile_review": { en: "Review Profile", zh: "查看档案" },
  "profile_focus_area": { en: "Focus area: ", zh: "聚焦领域：" },
  "profile_all_skills_mastered": { en: "All skills mastered for this MVP.", zh: "此MVP所有技能已掌握。" },
  // Rank ladder
  "rank_ladder_desc": { en: "XP milestones for the MVP learning loop.", zh: "MVP学习循环的经验里程碑。" },
  "rank_reached": { en: "Reached", zh: "已达到" },
  "rank_xp_remaining": { en: " XP remaining", zh: " 经验(剩余)" },
  // Research artifacts
  "artifacts_empty": { en: "Complete boss projects to build a portfolio of empirical research memos.", zh: "完成Boss项目以构建实证研究备忘录集。" },
  "artifacts_desc": { en: "Completed boss memos in your empirical workflow portfolio.", zh: "实证工作流中已完成的Boss备忘录。" },
  "artifacts_review": { en: "Review memo", zh: "查看备忘录" },
  // Mastery transcript
  "transcript_desc": { en: "Evidence of empirical research skills unlocked by boss projects.", zh: "Boss项目解锁的实证研究技能证明。" },
  "transcript_mastered": { en: "Mastered", zh: "已掌握" },
  "transcript_locked": { en: "Locked", zh: "未解锁" },
  // Progress backup
  "backup_desc": { en: "Export this JSON to move progress between browsers, or paste a backup and import it.", zh: "导出JSON以在浏览器间迁移进度，或粘贴备份导入。" },
  "backup_exported": { en: "Progress exported. Copy this JSON backup somewhere safe.", zh: "进度已导出。将此JSON备份存放安全处。" },
  "backup_too_large": { en: "Import failed. Progress JSON is too large for this MVP.", zh: "导入失败。进度JSON对此MVP来说太大。" },
  "backup_invalid": { en: "Import failed. Paste a valid Empirical Lab progress JSON backup.", zh: "导入失败。请粘贴有效的Empirical Lab进度JSON备份。" },
  "backup_reset_confirm": { en: "Reset all MVP progress?", zh: "重置所有MVP进度？" },
  // Skills view
  "skills_xp_remaining": { en: " XP remaining", zh: " 经验(剩余)" },
  "skills_focus_tag": { en: "Focus skill", zh: "聚焦技能" },
  "skills_practice_next": { en: "Practice next: ", zh: "下一练习：" },
  "skills_no_practice": { en: "No unlocked practice level right now.", zh: "暂无可解锁的练习关卡。" },
  "skills_related_complete": { en: " related levels complete", zh: " 相关关卡已完成" },
  "skills_mastery": { en: "% mastery", zh: "% 掌握" },
  // Misc labels
  "misc_reward": { en: "Reward:", zh: "奖励：" },
  "misc_locked": { en: "Locked:", zh: "未解锁：" },
  "misc_badge": { en: "Badge:", zh: "徽章：" },
  "misc_suggested_pace": { en: "Suggested pace:", zh: "建议用时：" },
  "misc_levels": { en: "levels", zh: "关卡" },
  "misc_glossary": { en: "Glossary:", zh: "术语：" },
  "next_up_label": { en: "Next up: ", zh: "接下来：" },
  "all_mvp_completed_short": { en: "All MVP levels completed.", zh: "所有MVP关卡已完成。" },
};
function t(key) { return (i18n[key] && i18n[key][getLang()]) || (i18n[key] && i18n[key]["en"]) || key; }

const skills = [
  ["panel", "Panel Data"],
  ["fe", "Fixed Effects"],
  ["cluster", "Clustered SE"],
  ["did", "DID"],
  ["event", "Event Study"],
  ["data", "Data Acquisition"],
  ["workflow", "Research Workflow"]
];

const badges = [
  ["panel-builder", "Panel Builder", "Identify panel units and time structure."],
  ["fe-apprentice", "Fixed Effects Apprentice", "Complete the Fixed Effects Lab boss."],
  ["cluster-survivor", "Clustered SE Survivor", "Choose the right clustering level."],
  ["parallel-inspector", "Parallel Trends Inspector", "Complete the DID & Event Study boss."],
  ["data-hunter", "Data Hunter", "Build a city-year dataset from web data."],
  ["junior-economist", "Junior Empirical Economist", "Finish the final empirical workflow."],
];

const quests = [
  { id: "fe", title: "Fixed Effects Lab", reward: "Fixed Effects Apprentice", summary: "Panel structure, within variation, two-way fixed effects, and clustered standard errors.", tags: ["Panel Data", "fixest", "pyfixest"], levels: ["fe-1", "fe-2", "fe-3", "fe-4", "fe-boss"] },
  { id: "did", title: "DID & Event Study", reward: "Parallel Trends Inspector", summary: "Treatment/control logic, DID estimands, parallel trends, event studies, and staggered timing pitfalls.", tags: ["Causal Inference", "DID", "Event Study"], levels: ["did-1", "did-2", "did-3", "did-4", "did-5", "did-6", "did-7", "did-boss"] },
  { id: "data", title: "Data Acquisition with Playwright", reward: "Data Hunter", summary: "Choose APIs, static scraping, or browser automation; recover hidden JSON requests; build panel-ready data.", tags: ["Playwright", "APIs", "Scraping"], levels: ["data-1", "data-2", "data-3", "data-4", "data-5", "data-boss"] },
  { id: "final", title: "Final Boss", reward: "Junior Empirical Economist", summary: "From raw data to causal estimate: acquire, clean, identify, estimate, visualize, and write a memo.", tags: ["Workflow", "Boss"], levels: ["workflow-1", "final-boss"] }
];

const levels = {
  "fe-1": { quest: "fe", n: 1, title: "Recognize Panel Data", xp: 30, skills: ["panel"], badge: "panel-builder", type: "mcq", story: "You receive a firm-year file from a research assistant. Before estimating anything, identify the unit and time dimensions.", concept: "Panel data repeats the same unit across time. The empirical index usually combines a unit id and a time id.", question: "For a firm-year dataset, which pair most likely defines the panel index?", options: ["firm_id and year", "industry and revenue", "profit and assets", "state and treatment"], answer: 0, feedback: "Correct. firm_id identifies the entity and year identifies time." },
  "fe-2": { quest: "fe", n: 2, title: "OLS vs Fixed Effects", xp: 30, skills: ["panel", "fe"], type: "mcq", story: "A naive OLS estimate says training subsidies raise firm output. But treated firms may be persistently more productive.", concept: "Fixed effects remove time-invariant unobserved heterogeneity. The coefficient is identified by within-unit changes over time.", question: "What problem can firm fixed effects help address?", options: ["Time-invariant unobserved firm productivity", "Random typos in column names", "Missing Python packages", "The need for larger fonts"], answer: 0, feedback: "Correct. Firm FE absorb stable firm-specific differences." },
  "fe-3": { quest: "fe", n: 3, title: "Two-Way Fixed Effects", xp: 35, skills: ["fe"], type: "code", story: "Now estimate a model with firm and year fixed effects.", concept: "Two-way FE controls for unit-specific levels and common time shocks. In fixest syntax, fixed effects go after the vertical bar.", question: "Complete a fixest model with firm and year fixed effects.", starter: "feols(y ~ x | _____ + _____, data = df)", required: ["firm_id", "year", "|"], pattern: "\\\\|\\\\s*firm_id\\\\s*\\\\+\\\\s*year", hint: "Use firm_id and year after the vertical bar.", feedback: "Good. This specification uses within-firm variation after removing year shocks." },
  "fe-4": { quest: "fe", n: 4, title: "Clustered Standard Errors", xp: 35, skills: ["cluster"], badge: "cluster-survivor", type: "mcq", story: "Treatment varies at the firm level and outcomes are observed for each firm over several years.", concept: "When errors may be correlated within the treatment-assignment unit, cluster at that level. This protects inference from serial correlation and within-cluster dependence.", question: "If treatment varies at firm level, what is the natural clustering level?", options: ["firm", "coefficient", "outcome", "row number"], answer: 0, feedback: "Correct. Cluster at firm level when treatment assignment and residual dependence are firm-level." },
  "fe-boss": { quest: "fe", n: "Boss", title: "Firm-Year Regression", xp: 100, skills: ["panel", "fe", "cluster"], badge: "fe-apprentice", type: "memo", story: "Boss project: estimate a firm-year model and explain what changes after adding FE and clustered SE.", concept: "A good empirical explanation names the variation used for identification, the fixed effects included, and the clustering level.", question: "Write a short interpretation mentioning firm FE, year FE, within-firm variation, and firm-clustered SE.", min: 80, required: ["firm", "year", "within", "cluster"], feedback: "Boss cleared. You connected specification, identifying variation, and inference." },

  "did-1": { quest: "did", n: 1, title: "Treatment and Control", xp: 30, skills: ["did"], type: "mcq", story: "A state adopts a minimum wage policy in 2015. Other states do not adopt during the sample window.", concept: "DID starts by defining treated units, comparison units, and pre/post periods.", question: "Which unit is treated in this setup?", options: ["The state that adopted the policy", "All states after 2015", "Only counties with missing data", "The control states before 2015"], answer: 0, feedback: "Correct. Treatment status is tied to the adopting state." },
  "did-2": { quest: "did", n: 2, title: "DID Estimand", xp: 30, skills: ["did"], type: "fill", story: "Treated employment rises by 10 after the policy. Control employment rises by 3 over the same period.", concept: "DID subtracts the control trend from the treated trend: (treated_post - treated_pre) - (control_post - control_pre).", question: "What is the DID estimate?", answer: ["7", "+7"], feedback: "Correct. The treated group changed 7 units more than the control group." },
  "did-3": { quest: "did", n: 3, title: "Diagnose Parallel Trends", xp: 35, skills: ["did", "event"], type: "mcq", story: "An event-study plot shows treated units rising faster than controls before treatment.", concept: "Parallel trends is an identification assumption about the untreated counterfactual trend, not something fixed by adding more packages.", question: "What is the main concern?", options: ["Parallel trends may fail", "Treatment effect is definitely zero", "Fixed effects are unnecessary", "The sample is too large"], answer: 0, feedback: "Correct. Pre-treatment divergence threatens the DID counterfactual." },
  "did-4": { quest: "did", n: 4, title: "DID in R", xp: 35, skills: ["did", "fe", "cluster"], type: "code", story: "Run a TWFE DID using fixest on state-year data.", concept: "A basic TWFE DID uses treatment as the regressor, state and year fixed effects, and state-clustered standard errors.", question: "Complete the fixed effects and clustering pieces.", starter: "feols(outcome ~ treatment | _____ + year, cluster = ~ _____, data = df)", required: ["state", "year", "cluster"], pattern: "\\\\|\\\\s*state\\\\s*\\\\+\\\\s*year[\\\\s\\\\S]*cluster\\\\s*=\\\\s*~\\\\s*state", hint: "State appears in both FE and cluster level.", feedback: "Good. This is the standard compact fixest DID specification." },
  "did-5": { quest: "did", n: 5, title: "DID in Python", xp: 35, skills: ["did", "fe", "cluster"], type: "code", story: "Implement the analogous Python workflow with pyfixest or a StatsPAI-style wrapper.", concept: "Python empirical workflows should still encode the same model: outcome, treatment, state FE, year FE, clustered SE.", question: "Write a Python formula containing treatment, state FE, and year FE.", starter: "pf.feols(\"outcome ~ treatment | _____ + _____\", data=df, vcov={\"CRV1\": \"_____\"})", required: ["state", "year", "treatment", "CRV1"], pattern: "treatment\\\\s*\\\\|\\\\s*state\\\\s*\\\\+\\\\s*year[\\\\s\\\\S]*CRV1[\\\\s\\\\S]*state", hint: "Use state + year fixed effects and cluster by state.", feedback: "Good. Same estimand, Python implementation." },
  "did-6": { quest: "did", n: 6, title: "Event Study", xp: 35, skills: ["event", "did"], type: "mcq", story: "You estimate dynamic leads and lags around treatment timing.", concept: "Pre-treatment coefficients are diagnostic. Post-treatment coefficients describe dynamic treatment effects relative to an omitted reference period.", question: "What should pre-treatment event-study coefficients ideally look like?", options: ["Close to zero and statistically indistinguishable from zero", "Always increasing", "Exactly equal to post-treatment effects", "Missing from the plot"], answer: 0, feedback: "Correct. Large pre-trends are a warning sign." },
  "did-7": { quest: "did", n: 7, title: "Staggered DID Pitfalls", xp: 35, skills: ["did", "event"], type: "mcq", story: "Different states adopt the policy in different years, and treatment effects vary over time.", concept: "TWFE can compare already-treated units to newly-treated units under staggered adoption, which can produce problematic weights.", question: "What is a known risk of naive TWFE under staggered treatment timing?", options: ["Negative or inappropriate comparison weights", "Python cannot load CSV files", "Fixed effects become illegal", "All treatment effects become identical"], answer: 0, feedback: "Correct. Modern DID estimators address these comparison problems." },
  "did-boss": { quest: "did", n: "Boss", title: "Minimum Wage Policy Evaluation", xp: 100, skills: ["did", "event", "cluster"], badge: "parallel-inspector", type: "memo", story: "Boss project: evaluate a minimum wage policy using a state-year panel.", concept: "A credible memo should define treatment, discuss pre-trends, name the estimator, and interpret uncertainty.", question: "Write a 120+ character policy memo mentioning treatment, control, parallel trends, event study, and clustered SE.", min: 120, required: ["treatment", "control", "parallel", "event", "cluster"], feedback: "Boss cleared. You wrote like an empirical researcher, not just a code runner." },

  "data-1": { quest: "data", n: 1, title: "API vs Scraping", xp: 30, skills: ["data"], type: "mcq", story: "You need city-level indicators from a public website. The site offers a documented API.", concept: "Prefer official APIs when available. Use static scraping when data is in HTML. Use browser automation when JavaScript rendering blocks direct access.", question: "What should you try first?", options: ["Use the official API", "Automate random clicks", "Screenshot every page", "Copy values by hand"], answer: 0, feedback: "Correct. APIs are usually more stable and reproducible." },
  "data-2": { quest: "data", n: 2, title: "Static HTML Tables", xp: 30, skills: ["data"], type: "mcq", story: "A page contains a plain HTML table with annual city data.", concept: "Static tables can often be parsed with pandas.read_html, BeautifulSoup, or R rvest.", question: "Which Python function is a fast first attempt for HTML tables?", options: ["pandas.read_html", "time.sleep", "matplotlib.plot", "feols"], answer: 0, feedback: "Correct. read_html is ideal for simple static tables." },
  "data-3": { quest: "data", n: 3, title: "Dynamic Website Problem", xp: 30, skills: ["data"], type: "mcq", story: "requests.get(url).text shows no table, but the browser displays one.", concept: "The browser may render data after JavaScript runs. The original HTML source is not always the rendered DOM.", question: "Most likely explanation?", options: ["The table is loaded dynamically by JavaScript", "Regression failed", "DID is invalid", "The CSV is too wide"], answer: 0, feedback: "Correct. Use network inspection or browser automation." },
  "data-4": { quest: "data", n: 4, title: "Playwright Basics", xp: 35, skills: ["data"], type: "code", story: "Use Playwright to wait for a rendered table before extracting rows.", concept: "Browser automation should wait for a stable selector before reading page content.", question: "Fill in the selector wait call.", starter: "page.goto(url)\npage.wait_for_selector(\"_____\")\nrows = page.locator(\"table tr\").all_inner_texts()", required: ["table"], pattern: "wait_for_selector\\\\(\\\\s*[\\\\\"']table[\\\\\"']\\\\s*\\\\)", hint: "Wait for the table selector.", feedback: "Good. Waiting prevents reading the page before data appears." },
  "data-5": { quest: "data", n: 5, title: "Network Request Detective", xp: 35, skills: ["data"], type: "mcq", story: "In DevTools Network, you see index.html, app.css, logo.png, and api/search?year=2020.", concept: "Many dynamic tables are populated by hidden JSON endpoints. Capturing that endpoint is cleaner than scraping rendered cells.", question: "Which request most likely returns the data?", options: ["api/search?year=2020", "logo.png", "app.css", "index.html"], answer: 0, feedback: "Correct. The API-like request likely contains structured JSON." },
  "data-boss": { quest: "data", n: "Boss", title: "Build a City-Year Dataset", xp: 100, skills: ["data", "panel"], badge: "data-hunter", type: "memo", story: "Boss project: collect multi-year web data and make it panel-ready.", concept: "A reproducible acquisition pipeline saves raw responses, documents source URLs, and outputs clean unit-time data.", question: "Write a data plan mentioning Playwright, raw data, city-year panel, and merge keys.", min: 100, required: ["playwright", "raw", "city", "year", "merge"], feedback: "Boss cleared. You connected acquisition to empirical design." },

  "workflow-1": { quest: "final", n: 1, title: "Order the Empirical Workflow", xp: 40, skills: ["workflow", "data", "did"], type: "ordering", story: "Before the final project, arrange the research pipeline in the order you would actually execute it.", concept: "A credible empirical workflow starts with data provenance, then panel construction and identification, then estimation, diagnostics, and communication.", question: "Click the steps in the correct order.", options: ["Acquire and save raw data", "Clean and construct a unit-time panel", "Define treatment and comparison groups", "Check pre-trends and identification assumptions", "Estimate DID / event-study models", "Write the memo with tables and figures"], answer: [0, 1, 2, 3, 4, 5], feedback: "Correct. You ordered the workflow from provenance to communication." },
  "final-boss": { quest: "final", n: "Final", title: "From Raw Data to Causal Estimate", xp: 300, skills: ["panel", "fe", "cluster", "did", "event", "data", "workflow"], badge: "junior-economist", type: "memo", story: "Final Boss: complete the MVP's full research arc, from raw data to a causal estimate and policy memo.", concept: "A complete empirical workflow links data provenance, panel construction, identification assumptions, estimator choice, inference, visualization, and interpretation.", question: "Write a final research plan mentioning raw data, panel construction, treatment, parallel trends, event study, clustered SE, and memo.", min: 180, required: ["raw", "panel", "treatment", "parallel", "event", "cluster", "memo"], feedback: "Final Boss cleared. You have the MVP loop: data → design → estimate → communicate." }
};

const notes = [
  ["panel", "Panel Data Structure", "Panel data repeats units over time. Always identify unit id, time id, treatment timing, and whether outcomes are balanced before estimating models."],
  ["ovb", "Omitted Variable Bias", "Bias appears when an omitted determinant of the outcome is correlated with the regressor. Fixed effects handle time-invariant omitted factors, not all omitted variables."],
  ["fe", "Fixed Effects and Within Variation", "Fixed effects estimate from within-unit changes after absorbing persistent unit differences and common time shocks."],
  ["cluster", "Clustered Standard Errors", "Cluster standard errors at the level where treatment or shocks are correlated. For panel policy designs this is often state, firm, school, or city."],
  ["po", "Potential Outcomes", "Causal inference asks what would have happened to treated units without treatment. Identification assumptions make that counterfactual estimable."],
  ["did", "DID Estimand", "DID subtracts the comparison group's change from the treated group's change to estimate an ATT under parallel trends."],
  ["parallel", "Parallel Trends", "Parallel trends says treated and control units would have followed the same trend without treatment. Pre-trend checks are diagnostic, not proof."],
  ["event", "Event Study", "Event studies estimate dynamic effects before and after treatment. Leads diagnose pre-trends; lags describe treatment dynamics."],
];

const tools = [
  ["fixest", "R", "High-dimensional fixed effects, DID, event studies, IV, clustered SE, and fast regression tables.", "FE formula syntax required; overkill for simple OLS."],
  ["did", "R", "Modern Difference-in-Differences estimators for staggered treatment timing.", "Use fixest for simple TWFE; this is for modern DID designs."],
  ["did2s", "R", "Two-stage DID estimator for settings where naive TWFE is problematic.", "Staggered DID only; not needed for simple two-period designs."],
  ["data.table", "R", "Fast data manipulation for large panel and administrative datasets.", "Steeper syntax; overkill for small teaching datasets."],
  ["StatsPAI", "Python", "Agent-native causal inference and applied econometrics toolkit for modern empirical workflows.", "Early-stage toolkit; verify outputs against known references."],
  ["pyfixest", "Python", "Python interface inspired by fixest for fixed effects regressions and empirical workflows.", "Feature parity with R fixest may be incomplete."],
  ["linearmodels", "Python", "Panel data, IV, and econometric model estimation in Python.", "Great for panels/IV; heavy for basic OLS."],
  ["pandas", "Python", "Core tabular data manipulation; useful for cleaning and reshaping raw data.", "Data wrangling only; pair with econometrics packages."],
  ["Playwright", "Python", "Browser automation for dynamic websites, rendered DOM extraction, downloads, and hidden request discovery.", "Slower than APIs; selectors can break when HTML changes."],
];

const methodToolMatrix = [
  ["Two-way fixed effects", "fixest", "pyfixest / linearmodels", "Start with the specification and clustering level before choosing syntax."],
  ["DID / staggered adoption", "did / did2s / fixest", "StatsPAI / pyfixest", "Use modern DID when timing varies or effects are heterogeneous."],
  ["Event study", "fixest", "StatsPAI / pyfixest", "Check leads as diagnostics; interpret lags as dynamic effects."],
  ["Panel data wrangling", "data.table", "pandas", "Validate unit-time keys before estimation."],
  ["Dynamic web data", "rvest / chromote", "Playwright", "Prefer APIs first; automate browsers only when rendering blocks access."],
];

const codeRecipes = [
  ["R TWFE", "feols(y ~ treatment | unit + year, cluster = ~ unit, data = df)", "Use when treatment varies within units over time and unit/year fixed effects match the design."],
  ["Python TWFE", "pf.feols(\"y ~ treatment | unit + year\", data=df, vcov={\"CRV1\": \"unit\"})", "Python-side analogue for fixest-style empirical specifications."],
  ["Event study", "feols(y ~ sunab(cohort, year) | unit + year, cluster = ~ unit, data = df)", "Use leads for pre-trend diagnostics and lags for dynamic treatment effects."],
  ["Playwright table", "page.wait_for_selector(\"table\"); rows = page.locator(\"table tr\").all_inner_texts()", "Use only after API/static HTML paths fail."],
];

const glossary = [
  ["Unit-time key", "The pair of columns that uniquely identifies one observation in a panel, such as firm_id and year."],
  ["Within variation", "The variation left after comparing a unit to itself over time, rather than comparing different units."],
  ["Clustered SE", "Standard errors that allow residual dependence inside a group such as firm, state, school, or city."],
  ["ATT", "Average treatment effect on treated units; the usual estimand in many DID designs."],
  ["Parallel trends", "The assumption that treated and control units would have followed the same untreated trend."],
  ["Event-study lead", "A coefficient for periods before treatment, used as a diagnostic for pre-trends."],
  ["Staggered adoption", "A treatment design where units receive treatment in different periods, which can make naive TWFE comparisons misleading."],
  ["Pre-trend", "The outcome path before treatment; useful for diagnosing whether treated and control units were already moving differently."],
  ["Raw data", "The source capture saved before cleaning so the research pipeline remains auditable."],
  ["Merge key", "The columns used to join datasets; wrong keys silently create duplicate or missing panel rows."],
  ["Replication package", "A shareable bundle of raw data notes, cleaning code, analysis data, figures, tables, and scripts that reproduces the result."],
];

function initialProgress() {
  return { xp: 0, completed: [], badges: [], lastDay: null, streak: 0 };
}
function loadProgress() {
  try { return normalizeProgress(JSON.parse(localStorage.getItem(STORE) || "{}")); }
  catch { return initialProgress(); }
}
function normalizeProgress(raw) {
  const base = initialProgress();
  const validLevelIds = new Set(Object.keys(levels));
  const validBadgeIds = new Set(badges.map(([id]) => id));
  const completedInput = Array.isArray(raw.completed) ? raw.completed.slice(0, validLevelIds.size * 2) : [];
  const badgesInput = Array.isArray(raw.badges) ? raw.badges.slice(0, validBadgeIds.size * 2) : [];
  const completed = completedInput.length ? [...new Set(completedInput.filter(id => validLevelIds.has(id)))] : base.completed;
  const importedBadges = badgesInput.length ? badgesInput.filter(id => validBadgeIds.has(id)) : base.badges;
  const derivedBadges = completed.map(levelId => levels[levelId].badge).filter(Boolean);
  const badgesClean = [...new Set([...importedBadges, ...derivedBadges])];
  const derivedXp = completed.reduce((sum, levelId) => sum + levels[levelId].xp, 0);
  return {
    xp: derivedXp,
    completed,
    badges: badgesClean,
    lastDay: /^\d{4}-\d{2}-\d{2}$/.test(raw.lastDay || "") ? raw.lastDay : base.lastDay,
    streak: Number.isFinite(Number(raw.streak)) ? Math.max(0, Number(raw.streak)) : base.streak
  };
}
let progress = loadProgress();
const sessionStartXp = progress.xp;
let passedLevel = null;
let orderingSelections = {};
function saveProgress() { localStorage.setItem(STORE, JSON.stringify(progress)); }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c])); }
function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function today() { return localDateString(new Date()); }
function yesterday() { const d = new Date(); d.setDate(d.getDate() - 1); return localDateString(d); }
function isDone(id) { return progress.completed.includes(id); }
function isQuestUnlocked(q) {
  if (q.id === "fe") return true;
  if (q.id === "did") return isDone("fe-boss");
  if (q.id === "data") return isDone("did-boss");
  if (q.id === "final") return isDone("fe-boss") && isDone("did-boss") && isDone("data-boss");
  return false;
}
function isLevelUnlocked(levelId) {
  const level = levels[levelId];
  if (!level) return false;
  const q = quests.find(item => item.id === level.quest);
  if (!q || !isQuestUnlocked(q)) return false;
  const index = q.levels.indexOf(levelId);
  return index === 0 || isDone(q.levels[index - 1]);
}
function questProgress(q) { return q.levels.filter(isDone).length / q.levels.length; }
function totalLevelCount() { return Object.keys(levels).length; }
function bossProjectCount() { return Object.values(levels).filter(level => level.n === "Boss" || level.n === "Final").length; }
function questPrerequisiteText(q) {
  if (q.id === "did") return t('prereq_did');
  if (q.id === "data") return t('prereq_data');
  if (q.id === "final") return t('prereq_final');
  return "";
}
function currentLevelName() {
  if (progress.xp >= 900) return t('rank_5');
  if (progress.xp >= 500) return t('rank_4');
  if (progress.xp >= 250) return t('rank_3');
  if (progress.xp >= 100) return t('rank_2');
  return t('rank_1');
}
function rankMilestones() {
  return [
    [0, t('rank_1')],
    [100, t('rank_2')],
    [250, t('rank_3')],
    [500, t('rank_4')],
    [900, t('rank_5')]
  ];
}
function nextXpMilestone() {
  const milestones = [
    [100, t('rank_2')],
    [250, t('rank_3')],
    [500, t('rank_4')],
    [900, t('rank_5')]
  ];
  return milestones.find(([xp]) => progress.xp < xp) || null;
}
function xpProgressSummary() {
  const milestone = nextXpMilestone();
  const sessionGain = Math.max(0, progress.xp - sessionStartXp);
  if (!milestone) return `${t('xp_session_max')}${sessionGain}${t('xp_max_rank')}`;
  const [target, label] = milestone;
  return `${t('xp_session_max')}${sessionGain}${t('xp_session_separator')}${target - progress.xp}${t('xp_to')}${label}`;
}
function skillPct(id) {
  const tagged = Object.entries(levels).filter(([, l]) => l.skills.includes(id));
  if (!tagged.length) return 0;
  return Math.round(tagged.filter(([levelId]) => isDone(levelId)).length / tagged.length * 100);
}
function focusSkill() {
  return skills
    .map(([id, name]) => ({ id, name, pct: skillPct(id), practice: nextLevelForSkill(id) }))
    .filter(skill => skill.pct < 100)
    .sort((a, b) => Boolean(b.practice) - Boolean(a.practice) || a.pct - b.pct || a.name.localeCompare(b.name))[0] || null;
}
function nextLevelForSkill(skillId) {
  return Object.entries(levels).find(([levelId, level]) => level.skills.includes(skillId) && isLevelUnlocked(levelId) && !isDone(levelId))?.[0] || null;
}
function focusSkillCallout() {
  const focus = focusSkill();
  if (!focus) return t('focus_all_complete');
  const average = Math.round(skills.reduce((sum, [id]) => sum + skillPct(id), 0) / skills.length);
  const lag = average - focus.pct;
  const context = lag > 20 ? t('focus_lagging') : lag < -10 ? t('focus_ahead') : t('focus_on_pace');
  return `${focus.name} is your focus skill (${focus.pct}%, ${context}). ${focus.practice ? `${t('focus_practice_next')}${levels[focus.practice].title}.` : t('focus_unlock_next')}`;
}
function nextLevelInQuest(q) {
  if (!q || !isQuestUnlocked(q)) return null;
  return q.levels.find(levelId => isLevelUnlocked(levelId) && !isDone(levelId)) || null;
}
function nextLevelId() {
  for (const q of quests) {
    const next = nextLevelInQuest(q);
    if (next) return next;
  }
  return null;
}
function routeNextLevel() {
  const next = nextLevelId();
  route(next ? "level" : "profile", next || undefined);
}
function homeSessionHint() {
  if (!progress.completed.length) return t('hint_start');
  const lastCompleted = progress.completed[progress.completed.length - 1];
  const lastLevel = levels[lastCompleted];
  const next = nextLevelId();
  if (lastLevel && (lastLevel.n === "Boss" || lastLevel.n === "Final")) {
    return next ? `${t('hint_quest_complete')}${levels[next].title}.` : t('hint_all_boss_complete');
  }
  return next ? `${t('hint_continue')}${levels[next].title}.` : t('hint_all_levels_complete');
}
function complete(id) {
  const l = levels[id];
  if (!l || passedLevel !== id || !isLevelUnlocked(id)) return false;
  if (!isDone(id)) {
    progress.completed.push(id);
    progress.xp += l.xp;
    if (l.badge && !progress.badges.includes(l.badge)) progress.badges.push(l.badge);
    const d = today();
    if (progress.lastDay !== d) {
      progress.streak = progress.lastDay === yesterday() ? progress.streak + 1 : 1;
      progress.lastDay = d;
    }
    saveProgress();
  }
  return true;
}
function route(view, id) { location.hash = id ? `${view}/${id}` : view; }
function navProgressBadge() {
  const next = nextLevelId();
  const completed = progress.completed.length;
  const total = Object.keys(levels).length;
  const label = next ? `${completed}/${total} · ${t('next')}: ${levels[next].title}` : `${completed}/${total} · ${t('mvp_complete')}`;
  return `<button class="nav-badge" onclick="routeNextLevel()" aria-label="${esc(label)}">${esc(label)}</button>`;
}
function themeToggleBtn() {
  const isDark = getTheme() === "dark";
  return `<button class="theme-toggle" onclick="toggleTheme()" aria-label="Switch to ${isDark ? 'light' : 'dark'} mode">[ ${isDark ? 'LGT' : 'DRK'} ]</button>`;
}
function langToggleBtn() {
  const isEn = getLang() === "en";
  return `<button class="theme-toggle" onclick="toggleLang()" aria-label="Switch to ${isEn ? 'Chinese' : 'English'}">[ ${isEn ? 'ZH' : 'EN'} ]</button>`;
}
function nav() {
  return `<header class="topbar"><button class="logo logo-button" onclick="route('home')" aria-label="Empirical Lab home"><span class="logo-mark">EL</span> Empirical Lab</button><nav class="nav" aria-label="Primary navigation">${navProgressBadge()}<button class="ghost" onclick="route('home')">${t('home')}</button><button class="ghost" onclick="route('quests')">${t('quest_map')}</button><button class="ghost" onclick="route('skills')">${t('skill_tree')}</button><button class="ghost" onclick="route('notes')">${t('notes')}</button><button class="ghost" onclick="route('glossary')">${t('glossary')}</button><button class="ghost" onclick="route('tools')">${t('toolkit')}</button><button class="ghost" onclick="route('profile')">${t('profile')}</button>${langToggleBtn()}${themeToggleBtn()}</nav></header>`;
}
function renderHome() {
  const levelCount = Object.keys(levels).length;
  const bossCount = Object.values(levels).filter(level => level.n === "Boss" || level.n === "Final").length;
  const next = nextLevelId();
  const ctaLabel = next ? (progress.completed.length ? `${t('continue_research')} (${progress.xp} XP)` : `${t('start_first_quest')} (${progress.xp} XP)`) : t('view_completed');
  const nextText = next ? `${t('next_up_label')}${esc(levels[next].title)}` : t('all_mvp_completed_short');
  app.innerHTML = shell(`<section class="hero"><div class="card"><h1>${t('hero_title')}</h1><p>${t('hero_desc')}</p><p class="muted">${nextText}</p><div class="actions"><button onclick="routeNextLevel()">${ctaLabel}</button><button class="secondary" onclick="route('quests')">${t('view_quest_map')}</button></div><div class="feedback"><strong>${t('session_cue')}:</strong> ${esc(homeSessionHint())}</div><div class="kpis"><div class="kpi"><strong>${levelCount}</strong><span class="muted">${t('levels')}</span></div><div class="kpi"><strong>${bossCount}</strong><span class="muted">${t('boss_projects')}</span></div><div class="kpi"><strong>${notes.length}</strong><span class="muted">${t('method_notes')}</span></div></div><div class="kpis"><div class="kpi"><strong>${totalMvpPaceLabel()}</strong><span class="muted">${t('mvp_time')}</span></div><div class="kpi"><strong>${remainingMvpPaceLabel()}</strong><span class="muted">${t('remaining')}</span></div><div class="kpi"><strong>${next ? paceLabel(levels[next]) : t('done')}</strong><span class="muted">${t('next_level')}</span></div></div></div><div class="card"><h2>${currentLevelName()}</h2><div class="kpis"><div class="kpi xp-display"><strong>${progress.xp}</strong><span>${t('xp')}</span></div><div class="kpi"><strong>${progress.streak}</strong><span>${t('streak')}</span></div></div><div class="feedback"><strong>${t('rank_progress')}:</strong> ${xpProgressSummary()}</div><p class="muted">${t('pipeline_progress')}: ${progress.completed.length} / ${levelCount} ${t('levels_completed')}</p><div class="feedback"><strong>${t('focus_skill')}:</strong> ${esc(focusSkillCallout())}</div><h3>${t('quest_progress')}</h3>${renderQuestProgressMini()}<h3>${t('concept_mastery')}</h3><p class="muted">Track the empirical ideas you are building, not just XP.</p>${renderSkillsMini()}<div class="actions"><button class="secondary" onclick="route('profile')">${t('open_profile')}</button></div></div></section><div class="section-title"><h2>${t('title_mvp_questlines')}</h2><span class="muted">${t('method_first')}.</span></div>${renderLearningPathway()}${renderStudyPlan()}${renderProgressSnapshot()}${renderBossLadder()}${renderQuestCards()}`);
}
function shell(content) { return `<main class="app-shell">${nav()}${content}<div class="footer">${t('footer')} /// ${today()}</div></main>`; }
function questPrerequisite(q) {
  if (q.id === "did") return t('prereq_did_full');
  if (q.id === "data") return t('prereq_data_full');
  if (q.id === "final") return t('prereq_final_full');
  return "";
}
function questStatusTag(q, unlocked, pct) {
  if (!unlocked) return "";
  if (pct === 0 && q.id !== "fe") return `<span class="tag">${t('tag_newly_unlocked')}</span>`;
  if (pct === 100) return `<span class="tag">${t('tag_complete')}</span>`;
  if (pct > 0) return `<span class="tag">${t('tag_in_progress')}</span>`;
  return `<span class="tag">${t('tag_start_here')}</span>`;
}
function questOutcome(questId) {
  const outcomes = {
    fe: t('outcome_fe'),
    did: t('outcome_did'),
    data: t('outcome_data'),
    final: t('outcome_final')
  };
  return outcomes[questId] || t('outcome_default');
}
function renderLearningPathway() {
  return `<div class="card"><h3>${t('learning_pathway')}</h3><p class="muted">${t('pathway_desc')}</p><div class="tags">${quests.map((q, index) => `<span class="tag">${index + 1}. ${esc(q.title)}${isQuestUnlocked(q) ? '' : t('pathway_locked')}</span>`).join('<span class="muted">→</span>')}</div></div>`;
}
function isQuestUnlockedWith(doneSet, q) {
  if (q.id === "fe") return true;
  if (q.id === "did") return doneSet.has("fe-boss");
  if (q.id === "data") return doneSet.has("did-boss");
  if (q.id === "final") return doneSet.has("fe-boss") && doneSet.has("did-boss") && doneSet.has("data-boss");
  return false;
}
function isLevelUnlockedWith(doneSet, levelId) {
  const level = levels[levelId];
  if (!level) return false;
  const q = quests.find(item => item.id === level.quest);
  if (!q || !isQuestUnlockedWith(doneSet, q)) return false;
  const index = q.levels.indexOf(levelId);
  return index === 0 || doneSet.has(q.levels[index - 1]);
}
function studyPlan(budgetMax = 30) {
  const doneSet = new Set(progress.completed);
  const plan = [];
  let total = [0, 0];
  for (const q of quests) {
    for (const levelId of q.levels) {
      if (doneSet.has(levelId) || !isLevelUnlockedWith(doneSet, levelId)) continue;
      const estimate = paceRange(levels[levelId]);
      if (plan.length && total[1] + estimate[1] > budgetMax) return { plan, total };
      plan.push(levelId);
      total = [total[0] + estimate[0], total[1] + estimate[1]];
      doneSet.add(levelId);
    }
  }
  return { plan, total };
}
function studyPlanGoal(plan) {
  if (!plan.length) return "";
  const q = quests.find(item => item.id === levels[plan[0]].quest);
  if (!q) return "";
  return `Goal: move toward ${levels[questBossLevel(q)].title}.`;
}
function studyPlanReward(plan) {
  return plan.reduce((sum, levelId) => sum + levels[levelId].xp, 0);
}
function renderStudyPlan() {
  const { plan, total } = studyPlan();
  if (!plan.length) return `<div class="card"><h3>${t('next_study_block')}</h3><p class="muted">${t('study_all_complete')}</p></div>`;
  return `<div class="card"><h3>${t('next_study_block')}</h3><p class="muted">${t('study_desc')}</p><p class="muted"><strong>${esc(studyPlanGoal(plan))}</strong></p><p class="muted"><strong>${t('study_block_reward')}</strong> +${studyPlanReward(plan)} XP</p><div class="level-list">${plan.map((levelId, index) => `<div class="level-row"><div class="level-num">${index + 1}</div><div><strong>${esc(levels[levelId].title)}</strong><div class="tags"><span class="tag">${esc(challengeTypeLabel(levels[levelId].type))}</span><span class="tag">${paceLabel(levels[levelId])}</span><span class="tag">+${levels[levelId].xp} XP</span></div></div><button class="secondary" onclick="route('level','${levelId}')">${t('open')}</button></div>`).join("")}</div><p class="muted">${t('study_estimated_block')} ${formatPaceRange(total)}</p></div>`;
}
function renderProgressSnapshot() {
  return `<div class="card"><h3>${t('progress_snapshot')}</h3><p class="muted">${t('snapshot_desc')}</p><div class="level-list">${quests.map((q, index) => { const completed = q.levels.filter(isDone).length; const unlocked = isQuestUnlocked(q); const pct = Math.round(questProgress(q) * 100); return `<div class="level-row ${pct === 100 ? 'done' : ''} ${unlocked ? '' : 'locked'}"><div class="level-num">${index + 1}</div><div><strong>${esc(q.title)}</strong><div class="muted">${completed}/${q.levels.length} ${t('misc_levels')} · ${pct}% · ${questRemainingPaceLabel(q)}${unlocked ? '' : ` · ${esc(questPrerequisite(q))}`}</div><div class="progress"><span style="width:${pct}%"></span></div></div><button class="secondary" ${unlocked ? '' : 'disabled'} onclick="route('quest','${q.id}')">${unlocked ? t('open') : t('locked')}</button></div>`; }).join('')}</div></div>`;
}
function renderBossLadder() {
  const ladder = bossMilestones();
  return `<div class="card"><h3>${t('boss_ladder')}</h3><p class="muted">${t('boss_ladder_desc')}</p><div class="level-list">${ladder.map(([levelId, title, desc], index) => `<div class="level-row ${isDone(levelId) ? 'done' : ''} ${isLevelUnlocked(levelId) ? '' : 'locked'}"><div class="level-num">${index + 1}</div><div><strong>${esc(title)}</strong><div class="muted">${esc(desc)}</div></div><button class="secondary" ${isLevelUnlocked(levelId) ? '' : 'disabled'} onclick="route('level','${levelId}')">${isDone(levelId) ? t('review') : isLevelUnlocked(levelId) ? t('open') : t('locked')}</button></div>`).join('')}</div></div>`;
}
function renderQuestCards() {
  return `<div class="grid">${quests.map(q => { const pct = Math.round(questProgress(q) * 100); const unlocked = isQuestUnlocked(q); const lockedReason = questPrerequisite(q); const progressClass = pct === 100 ? 'quest-mastered' : pct > 0 ? 'quest-in-progress' : ''; return `<article class="card quest-card ${unlocked ? '' : 'locked'} ${progressClass}" data-label="QST-${q.id.toUpperCase()}" data-progress="${pct}" title="${unlocked ? '' : esc(lockedReason)}"><div class="tags">${q.tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join("")}${questStatusTag(q, unlocked, pct)}<span class="tag">${questPaceLabel(q)}</span><span class="tag">${questRemainingPaceLabel(q)}</span></div><h3>${esc(q.title)}</h3><p class="muted">${esc(q.summary)}</p><p class="muted"><strong>${esc(questOutcome(q.id))}</strong></p><div><div class="progress"><span style="width:${pct}%"></span></div><p class="muted">${pct}% complete · ${unlocked ? `${t('misc_reward')} ${esc(q.reward)}` : `${t('misc_locked')} ${esc(lockedReason)}`}</p></div><div class="actions"><button ${unlocked ? '' : 'disabled'} onclick="route('quest','${q.id}')">${unlocked ? t('open_quest') : t('locked')}</button></div></article>`; }).join("")}</div>`;
}
function renderQuests() { app.innerHTML = shell(`<div class="section-title"><h2>${t('title_quest_map')}</h2><span class="muted">${t('sub_quest_map')}</span></div>${renderLearningPathway()}${renderStudyPlan()}${renderProgressSnapshot()}${renderBossLadder()}${renderQuestCards()}`); }
function challengeTypeLabel(type) {
  return {
    mcq: t('type_mcq'),
    fill: t('type_fill'),
    code: t('type_code'),
    memo: t('type_memo'),
    ordering: t('type_ordering')
  }[type] || t('type_default');
}
function paceRange(level) {
  if (level.n === "Boss" || level.n === "Final") return [20, 30];
  return {
    mcq: [3, 5],
    fill: [3, 5],
    code: [8, 12],
    memo: [12, 20],
    ordering: [5, 8]
  }[level.type] || [5, 10];
}
function paceLabel(level) {
  const [min, max] = paceRange(level);
  return `${min}-${max} ${t('pace_min')}`;
}
function questPaceLabel(q) {
  const total = q.levels.reduce((sum, levelId) => {
    const [min, max] = paceRange(levels[levelId]);
    return [sum[0] + min, sum[1] + max];
  }, [0, 0]);
  return `${total[0]}-${total[1]} ${t('pace_min_total')}`;
}
function formatPaceRange(range) {
  const [min, max] = range;
  if (max === 0) return t('pace_0_min');
  if (max < 60) return `${min}-${max} ${t('pace_min')}`;
  return `${(min / 60).toFixed(1)}-${(max / 60).toFixed(1)} ${t('pace_hrs')}`;
}
function totalMvpPaceLabel() {
  return formatPaceRange(Object.values(levels).reduce((sum, level) => {
    const [min, max] = paceRange(level);
    return [sum[0] + min, sum[1] + max];
  }, [0, 0]));
}
function remainingMvpPaceLabel() {
  return formatPaceRange(Object.entries(levels).filter(([levelId]) => !isDone(levelId)).reduce((sum, [, level]) => {
    const [min, max] = paceRange(level);
    return [sum[0] + min, sum[1] + max];
  }, [0, 0]));
}
function questRemainingPaceLabel(q) {
  const remaining = q.levels.filter(levelId => !isDone(levelId)).reduce((sum, levelId) => {
    const [min, max] = paceRange(levels[levelId]);
    return [sum[0] + min, sum[1] + max];
  }, [0, 0]);
  return remaining[1] === 0 ? t('pace_0_min_remaining') : `${remaining[0]}-${remaining[1]} ${t('pace_min_remaining')}`;
}
function levelUnlockHint(q, levelId) {
  const index = q.levels.indexOf(levelId);
  if (index <= 0) return "";
  return `${t('unlock_by')}${levels[q.levels[index - 1]].title}`;
}
function questMethodReminder(questId) {
  const reminders = {
    fe: t('reminder_fe'),
    did: t('reminder_did'),
    data: t('reminder_data'),
    final: t('reminder_final')
  };
  return reminders[questId] || "";
}
function questContext(questId) {
  const contexts = {
    did: t('context_did'),
    data: t('context_data'),
    final: t('context_final')
  };
  return contexts[questId] || "";
}
function renderQuestContext(q) {
  const context = questContext(q.id);
  return context ? `<div class="feedback"><strong>${t('why_this_quest')}:</strong> ${esc(context)}</div>` : "";
}
function questChecklist(questId) {
  const items = {
    fe: ["Identify unit-time keys", "Explain within variation", "Choose clustering level"],
    did: ["Define treated and control groups", "Check pre-trends", "Handle staggered timing carefully"],
    data: ["Prefer API or raw JSON when possible", "Save raw source files", "Validate merge keys before analysis", "Respect terms, rate limits, and robots guidance"],
    final: ["Connect data provenance to design", "State the causal assumption", "Report estimate, diagnostic, and memo conclusion", "Prepare a replication package trail"]
  };
  return items[questId] || [];
}
function renderQuestChecklist(q) {
  const items = questChecklist(q.id);
  if (!items.length) return "";
  return `<details class="feedback" open><summary>${t('research_checklist')}</summary><ul>${items.map(item => `<li>${esc(item)}</li>`).join("")}</ul></details>`;
}
function renderQuestConceptMeter(q) {
  const skillIds = [...new Set(q.levels.flatMap(levelId => levels[levelId].skills))];
  if (!skillIds.length) return "";
  return `<div class="feedback"><strong>${t('concept_mastery')}:</strong>${skillIds.map(skillId => {
    const skillName = skills.find(([id]) => id === skillId)?.[1] || skillId;
    const related = q.levels.filter(levelId => levels[levelId].skills.includes(skillId));
    const pct = Math.round(related.filter(isDone).length / related.length * 100);
    return `<div class="skill"><div class="skill-head"><span>${esc(skillName)}</span><span>${pct}%</span></div><div class="progress"><span style="width:${pct}%"></span></div></div>`;
  }).join("")}</div>`;
}
function questBossLevel(q) {
  return q.levels.find(levelId => levels[levelId].n === "Boss" || levels[levelId].n === "Final") || q.levels[q.levels.length - 1];
}
function levelsToBoss(q, bossId) {
  const bossIndex = q.levels.indexOf(bossId);
  return q.levels.slice(0, bossIndex + 1).filter(levelId => !isDone(levelId)).length;
}
function renderQuest(id) {
  const q = quests.find(x => x.id === id) || quests[0];
  if (!isQuestUnlocked(q)) return renderQuests();
  const next = nextLevelInQuest(q);
  const boss = questBossLevel(q);
  const bossRemaining = levelsToBoss(q, boss);
  const reminder = questMethodReminder(q.id);
  const nextHint = next ? `<div class="feedback ok"><strong>${t('quest_next_up')}</strong> ${esc(levels[next].title)}</div>` : `<div class="feedback ok">${t('quest_complete')}</div>`;
  app.innerHTML = shell(`<div class="section-title"><div><h2>${esc(q.title)}</h2><p class="muted">${esc(q.summary)}</p>${reminder ? `<p class="muted"><strong>${t('quest_method_reminder')}</strong> ${esc(reminder)}</p>` : ''}<p class="muted"><strong>${esc(questOutcome(q.id))}</strong></p><p class="muted"><strong>${t('quest_boss_target')}</strong> ${esc(levels[boss].title)} · ${bossRemaining} ${t('quest_levels_to_boss')}</p><p class="muted">${t('quest_estimated_time')} ${questPaceLabel(q)} · ${questRemainingPaceLabel(q)}</p></div><button class="secondary" onclick="route('quests')">${t('quest_back')}</button></div><div class="card"><div class="progress"><span style="width:${Math.round(questProgress(q)*100)}%"></span></div>${nextHint}${renderQuestContext(q)}${renderQuestChecklist(q)}${renderQuestConceptMeter(q)}<div class="level-list">${q.levels.map((levelId) => { const l = levels[levelId]; const done = isDone(levelId); const unlocked = isLevelUnlocked(levelId); return `<div class="level-row ${done ? 'done' : ''} ${unlocked ? '' : 'locked'}"><div class="level-num">${esc(l.n)}</div><div><strong>${esc(l.title)}</strong><div class="tags">${next === levelId ? `<span class="tag">${t('next')}</span>` : ''}${boss === levelId ? `<span class="tag">${t('boss_target')}</span>` : ''}<span class="tag">${esc(challengeTypeLabel(l.type))}</span><span class="tag">${l.xp} XP</span><span class="tag">${paceLabel(l)}</span></div><div class="muted">${unlocked ? `${esc(l.concept.slice(0, 120))}...` : esc(levelUnlockHint(q, levelId))}</div></div><button class="${done ? 'secondary' : ''}" ${unlocked ? '' : 'disabled'} onclick="route('level','${levelId}')">${done ? t('review') : unlocked ? t('start') : t('locked')}</button></div>`; }).join("")}</div></div>`);
}
function notePitfall(id) {
  const pitfalls = {
    panel: "Do not estimate before checking duplicate unit-time rows and missing years.",
    ovb: "Fixed effects only remove stable omitted factors, not time-varying confounders.",
    fe: "A FE coefficient is not identified by differences between units that never change treatment.",
    cluster: "Cluster at the assignment or dependence level, not whichever level makes p-values smaller.",
    po: "Potential outcomes clarify the estimand; they do not prove the counterfactual is valid.",
    did: "A clean 2x2 DID intuition may fail under staggered timing and heterogeneous effects.",
    parallel: "Flat pre-trends help, but they do not rule out future time-varying confounds.",
    event: "Do not treat noisy pre-period coefficients as proof of parallel trends."
  };
  return pitfalls[id] || "Check the identifying assumption before trusting the package output.";
}
function relatedNoteCards(level) {
  const related = notes.filter(([id]) => level.skills.includes(id)).slice(0, 2);
  if (!related.length) return "";
  return `<details class="feedback"><summary>${t('note_quick_method')}</summary>${related.map(([id, title, body]) => `<h4>${esc(title)}</h4><p class="muted">${esc(body)}</p><p class="muted"><strong>${t('note_common_pitfall')}</strong> ${esc(notePitfall(id))}</p><p class="muted"><strong>${t('note_ask_yourself')}</strong> ${esc(noteQuestion(id))}</p>${renderGlossaryTermTags(id)}`).join("")}</details>`;
}
function renderLevel(id) {
  const safeId = levels[id] ? id : "fe-1";
  const l = levels[safeId];
  if (!isLevelUnlocked(safeId)) return renderQuest(l.quest);
  app.innerHTML = shell(`<div class="player"><section class="card"><div class="tags">${l.skills.map(s => `<span class="tag">${skills.find(x=>x[0]===s)?.[1] || s}</span>`).join("")}</div><h1>${esc(l.title)}</h1><p class="muted"><strong>${t('story')}:</strong> ${esc(l.story)}</p><h3>${t('concept_note')}</h3><p>${esc(l.concept)}</p>${relatedNoteCards(l)}<h3>${t('challenge')}</h3><div id="challenge" class="challenge">${renderChallenge(l, safeId)}</div></section><aside class="card"><h3>${t('reward')}</h3><p class="muted">+${l.xp} XP ${l.badge ? `· ${t('misc_badge')} ${badgeName(l.badge)}` : ''}</p><p class="muted">${t('misc_suggested_pace')} ${paceLabel(l)}</p><h3>${t('related_notes')}</h3>${l.skills.map(s => `<button class="ghost" onclick="route('notes')">${skills.find(x=>x[0]===s)?.[1]}</button>`).join(" ")}<h3>${t('quest')}</h3><button class="secondary" onclick="route('quest','${l.quest}')">${t('back_to_quest')}</button></aside></div>`);
}
function memoChecklist(level) {
  if (level.type !== "memo") return "";
  return `<details class="feedback" open><summary>${t('memo_checklist')}</summary><ul>${level.required.map(item => `<li>${esc(item)}</li>`).join("")}</ul><p class="muted">Write a connected research narrative, not a keyword list: design → assumption → estimate → interpretation.</p></details>`;
}
function completedChallengeSummary(level, id) {
  if (!isDone(id)) return "";
  const summary = level.type === "mcq" ? `${t('correct_answer')}${level.options[level.answer]}`
    : level.type === "fill" ? `${t('accepted_answer')}${level.answer.join(" or ")}`
    : level.type === "code" ? expectedCodeHint(id)
    : level.type === "ordering" ? t('completed_ordering')
    : `${t('completed_memo')}${memoMethodHint(id)}`;
  return `<div class="feedback ok"><strong>${t('review_mode_label')}</strong> ${t('xp_already_earned_inline')} ${esc(summary)}</div>`;
}
function optionKeyAttrs() {
  return `onkeydown="handleOptionKey(event)" aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"`;
}
function handleOptionKey(event) {
  if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) return;
  const options = Array.from(event.currentTarget.parentElement.querySelectorAll(".option"));
  const index = options.indexOf(event.currentTarget);
  if (index < 0) return;
  event.preventDefault();
  const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
  options[(index + direction + options.length) % options.length].focus();
}
function relatedCodeRecipe(id) {
  const map = {
    "fe-3": "R TWFE",
    "did-4": "R TWFE",
    "did-5": "Python TWFE",
    "data-4": "Playwright table"
  };
  const recipe = codeRecipes.find(([name]) => name === map[id]);
  if (!recipe) return "";
  const [name, pattern, use] = recipe;
  return `<details class="feedback"><summary>Related code recipe: ${esc(name)}</summary><pre>${esc(pattern)}</pre><p class="muted">${esc(use)}</p></details>`;
}
function renderChallenge(l, id) {
  const review = completedChallengeSummary(l, id);
  if (l.type === "mcq") return `${review}<p>${esc(l.question)}</p>${l.options.map((o, i) => `<button class="option" ${optionKeyAttrs()} onclick="checkMCQ('${id}',${i})">${String.fromCharCode(65+i)}. ${esc(o)}</button>`).join("")}<div id="feedback" role="status" aria-live="polite"></div>`;
  if (l.type === "fill") return `${review}<p>${esc(l.question)}</p><input id="answer" placeholder="Your answer"/><button onclick="checkFill('${id}')">${t('submit')}</button><div id="feedback" role="status" aria-live="polite"></div>`;
  if (l.type === "ordering") return `${review}${renderOrderingChallenge(l, id)}`;
  if (l.type === "code") return `${review}<p>${esc(l.question)}</p>${relatedCodeRecipe(id)}<pre>${esc(l.starter)}</pre><textarea id="answer" spellcheck="false" placeholder="Complete or rewrite the code here">${esc(l.starter)}</textarea><p class="muted">Hint: ${esc(l.hint)}</p><button onclick="checkCode('${id}')">${t('run_static_check')}</button><div id="feedback" role="status" aria-live="polite"></div>`;
  return `${review}<p>${esc(l.question)}</p>${memoChecklist(l)}<textarea id="answer" placeholder="Write your memo or plan here"></textarea><button onclick="checkMemo('${id}')">${t('submit_memo')}</button><div id="feedback" role="status" aria-live="polite"></div>`;
}
function clearFeedback() {
  passedLevel = null;
  const target = document.getElementById("feedback");
  if (target) target.innerHTML = "";
}
function setFeedback(ok, text, id) {
  if (!levels[id]) return clearFeedback();
  passedLevel = ok ? id : null;
  document.getElementById("feedback").innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}">${esc(text)}</div>${ok ? `<div class="actions"><button onclick="collectPassedLevel()">${t('collect_xp')}</button></div>` : ''}`;
}
function collectPassedLevel() {
  if (passedLevel) completeAndContinue(passedLevel);
}
function renderOrderingChallenge(l, id) {
  orderingSelections[id] = orderingSelections[id] || [];
  return `<p>${esc(l.question)}</p><div class="level-list">${l.options.map((option, index) => `<button class="option" ${optionKeyAttrs()} onclick="selectOrdering('${id}', ${index})">${esc(option)}</button>`).join("")}</div><div id="ordering-${id}" class="feedback" role="status" aria-live="polite">${t('selected_order_none_full')}</div><div class="actions"><button onclick="checkOrdering('${id}')">${t('check_order')}</button><button class="secondary" onclick="resetOrdering('${id}')">${t('reset')}</button></div><div id="feedback" role="status" aria-live="polite"></div>`;
}
function updateOrderingView(id) {
  const target = document.getElementById(`ordering-${id}`);
  if (!target) return;
  const selected = orderingSelections[id] || [];
  target.innerHTML = selected.length ? `${t('selected_order_prefix')}${selected.map((optionIndex, i) => `${i + 1}. ${esc(levels[id].options[optionIndex])}`).join(" → ")}` : t('selected_order_none_full');
}
function selectOrdering(id, index) {
  const l = levels[id];
  if (!l || l.type !== "ordering" || !isLevelUnlocked(id)) return clearFeedback();
  orderingSelections[id] = orderingSelections[id] || [];
  if (!orderingSelections[id].includes(index)) orderingSelections[id].push(index);
  updateOrderingView(id);
}
function resetOrdering(id) {
  const l = levels[id];
  if (!l || l.type !== "ordering") return;
  orderingSelections[id] = [];
  passedLevel = null;
  updateOrderingView(id);
  document.getElementById("feedback").innerHTML = "";
}
function checkOrdering(id) {
  const l = levels[id];
  if (!l || l.type !== "ordering" || !isLevelUnlocked(id)) return clearFeedback();
  const selected = orderingSelections[id] || [];
  const ok = selected.length === l.answer.length && selected.every((value, index) => value === l.answer[index]);
  setFeedback(ok, ok ? l.feedback : t('ordering_wrong'), id);
}
function checkMCQ(id, i) {
  const l = levels[id];
  if (!l || l.type !== "mcq" || !isLevelUnlocked(id)) return clearFeedback();
  setFeedback(i === l.answer, i === l.answer ? l.feedback : `${t('mcq_wrong_prefix')}${l.concept}${t('mcq_wrong_suffix')}`, id);
}
function checkFill(id) {
  const l = levels[id];
  if (!l || l.type !== "fill" || !isLevelUnlocked(id)) return clearFeedback();
  const v = document.getElementById("answer").value.trim().toLowerCase();
  const ok = l.answer.map(String).map(x=>x.toLowerCase()).includes(v);
  setFeedback(ok, ok ? l.feedback : `${t('mcq_wrong_prefix')}${l.concept}${t('mcq_wrong_suffix')}`, id);
}
function stripCodeComments(raw) {
  return raw
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/"""[\s\S]*?"""/g, "")
    .replace(/'''[\s\S]*?'''/g, "")
    .split("\n")
    .filter(line => !/^\s*(#|\/\/)/.test(line))
    .join("\n");
}
function codeChallengeValid(id, raw) {
  const code = stripCodeComments(raw);
  if (id === "fe-3") return /^\s*feols\([\s\S]*\|\s*firm_id\s*\+\s*year[\s\S]*data\s*=\s*df[\s\S]*\)\s*$/i.test(code);
  if (id === "did-4") return /^\s*feols\([\s\S]*outcome\s*~\s*treatment[\s\S]*\|\s*state\s*\+\s*year[\s\S]*cluster\s*=\s*~\s*state[\s\S]*data\s*=\s*df[\s\S]*\)\s*$/i.test(code);
  if (id === "did-5") return /^\s*pf\.feols\([\s\S]*outcome\s*~\s*treatment\s*\|\s*state\s*\+\s*year[\s\S]*data\s*=\s*df[\s\S]*CRV1[\s\S]*state[\s\S]*\)\s*$/i.test(code);
  if (id === "data-4") return /^[\s\S]*page\.goto\(url\)[\s\S]*page\.wait_for_selector\(\s*["']table["']\s*\)[\s\S]*rows\s*=\s*page\.locator\(\s*["']table tr["']\s*\)\.all_inner_texts\(\s*\)[\s\S]*$/i.test(code);
  return true;
}
function expectedCodeHint(id) {
  if (id === "fe-3") return "Expected structure: feols(y ~ x | firm_id + year, data = df)";
  if (id === "did-4") return "Expected structure: feols(outcome ~ treatment | state + year, cluster = ~ state, data = df)";
  if (id === "did-5") return "Expected structure: pf.feols(\"outcome ~ treatment | state + year\", data=df, vcov={\"CRV1\": \"state\"})";
  if (id === "data-4") return "Expected structure: page.goto(url), page.wait_for_selector(\"table\"), then page.locator(\"table tr\").all_inner_texts()";
  return "Review the starter code and fill every required part.";
}
function checkCode(id) {
  const l = levels[id];
  if (!l || l.type !== "code" || !isLevelUnlocked(id)) return clearFeedback();
  const raw = document.getElementById("answer").value;
  const code = stripCodeComments(raw);
  const v = code.toLowerCase();
  const hasRequiredTokens = l.required.every(t => v.includes(String(t).toLowerCase()));
  const ok = !code.includes("_____") && hasRequiredTokens && codeChallengeValid(id, raw);
  const missing = l.required.filter(t => !v.includes(String(t).toLowerCase()));
  const message = code.includes("_____")
    ? t('code_fill_blanks')
    : missing.length
      ? `${t('code_missing_token')}${missing.join(', ')}. ${expectedCodeHint(id)}`
      : `${t('code_close_but_wrong')} ${expectedCodeHint(id)}`;
  setFeedback(ok, ok ? l.feedback : message, id);
}
function memoMethodHint(id) {
  const hints = {
    "fe-boss": "Specify the FE model → explain within-unit identifying variation → justify clustered SE → interpret the coefficient.",
    "did-boss": "Name treatment and control groups → discuss pre-trend evidence → name the estimator → explain the policy implication.",
    "data-boss": "Describe raw source capture → explain city-year panel construction → name merge keys → list validation checks.",
    "final-boss": "Acquire raw data → build panel → state treatment assumption → estimate and diagnose → write the policy conclusion."
  };
  return hints[id] || "Connect design → assumption → estimate → interpretation.";
}
function checkMemo(id) {
  const l = levels[id];
  if (!l || l.type !== "memo" || !isLevelUnlocked(id)) return clearFeedback();
  const raw = document.getElementById("answer").value;
  if (raw.length > 5000) return setFeedback(false, t('memo_too_long'), id);
  const v = raw.toLowerCase();
  const ok = v.length >= l.min && l.required.every(tok => v.includes(tok));
  const success = `${l.feedback} Method hint: ${memoMethodHint(id)}`;
  setFeedback(ok, ok ? success : `${t('memo_needs')}${l.min}${t('memo_chars_and_ideas')}${l.required.join(', ')}`, id);
}
function completeAndContinue(id) {
  if (!complete(id)) return;
  passedLevel = null;
  const q = quests.find(x => x.id === levels[id].quest);
  const idx = q.levels.indexOf(id);
  const next = q.levels[idx+1];
  route(next ? 'level' : 'quest', next || q.id);
}
function badgeName(id) { return badges.find(b => b[0] === id)?.[1] || id; }
function renderQuestProgressMini() {
  return quests.map(q => {
    const completed = q.levels.filter(isDone).length;
    const unlocked = isQuestUnlocked(q);
    return `<div class="skill"><div class="skill-head"><span>${esc(q.title)}</span><span>${completed}/${q.levels.length} ${t('misc_levels')}${unlocked ? '' : t('pathway_locked')}</span></div><div class="progress"><span style="width:${Math.round(questProgress(q) * 100)}%"></span></div></div>`;
  }).join("");
}
function skillXpRemaining(skillId) {
  return Object.entries(levels)
    .filter(([levelId, level]) => level.skills.includes(skillId) && !isDone(levelId))
    .reduce((sum, [, level]) => sum + level.xp, 0);
}
function renderSkillsMini() { return skills.map(([id, name]) => { const pct = skillPct(id); const remaining = skillXpRemaining(id); return `<div class="skill"><div class="skill-head"><span>${name}</span><span>${pct}% · ${remaining}${t('skills_xp_remaining')}</span></div><div class="progress"><span style="width:${pct}%"></span></div></div>`; }).join(""); }
function renderSkillsDetailed() {
  const focus = focusSkill();
  return `<div class="grid two">${skills.map(([id, name]) => {
    const pct = skillPct(id);
    const related = Object.entries(levels).filter(([, level]) => level.skills.includes(id));
    const completed = related.filter(([levelId]) => isDone(levelId)).length;
    const next = nextLevelForSkill(id);
    const remaining = skillXpRemaining(id);
    const isFocus = focus?.id === id;
    return `<article class="card skill-card ${isFocus ? 'focus-skill quest-in-progress' : ''}"><div class="tags">${isFocus ? `<span class="tag">${t('skills_focus_tag')}</span>` : ''}<span class="tag">${remaining}${t('skills_xp_remaining')}</span></div><h3>${esc(name)}</h3><div class="progress"><span style="width:${pct}%"></span></div><p class="muted">${completed}/${related.length}${t('skills_related_complete')} · ${pct}${t('skills_mastery')}</p><p class="muted">${next ? `${t('skills_practice_next')}${esc(levels[next].title)}` : t('skills_no_practice')}</p><div class="tags">${related.slice(0, 4).map(([levelId]) => `<span class="tag">${esc(levels[levelId].title)}</span>`).join("")}</div></article>`;
  }).join("")}</div>`;
}
function renderSkills() { app.innerHTML = shell(`<div class="section-title"><h2>${t('title_skill_tree')}</h2><span class="muted">${t('sub_skill_tree')}</span></div>${renderSkillsDetailed()}`); }
function bossMilestones() {
  return [
    ["fe-boss", "Fixed effects workflow", "Specified TWFE models, within-unit variation, and clustered inference."],
    ["did-boss", "Policy evaluation workflow", "Defined treatment/control groups, checked pre-trends, and interpreted event-study evidence."],
    ["data-boss", "Data acquisition workflow", "Captured web data, saved raw sources, built panel keys, and planned validation checks."],
    ["final-boss", "Full empirical workflow", "Connected raw data, panel construction, identification, estimation, diagnostics, and memo writing."]
  ];
}
function renderResearchArtifacts() {
  const completed = bossMilestones().filter(([levelId]) => isDone(levelId));
  if (!completed.length) return `<div class="card" style="margin-top:16px"><h3>${t('research_artifacts')}</h3><p class="muted">${t('artifacts_empty')}</p></div>`;
  return `<div class="card" style="margin-top:16px"><h3>${t('research_artifacts')}</h3><p class="muted">${t('artifacts_desc')}</p><div class="badges">${completed.map(([levelId, title, desc]) => `<div class="badge"><strong>${esc(levels[levelId].title)} · ${levels[levelId].xp} XP</strong><p class="muted">${esc(title)}: ${esc(desc)}</p><button class="secondary" onclick="route('level','${levelId}')">${t('artifacts_review')}</button></div>`).join("")}</div></div>`;
}
function renderMasteryTranscript() {
  const milestones = bossMilestones();
  return `<div class="card" style="margin-top:16px"><h3>${t('mastery_transcript')}</h3><p class="muted">${t('transcript_desc')}</p><div class="badges">${milestones.map(([levelId, title, desc]) => `<div class="badge ${isDone(levelId) ? '' : 'locked'}"><strong>${isDone(levelId) ? t('transcript_mastered') : t('transcript_locked')} · ${esc(title)}</strong><p class="muted">${esc(desc)}</p></div>`).join("")}</div></div>`;
}
function renderRankLadder() {
  return `<div class="card" style="margin-top:16px"><h3>${t('rank_ladder')}</h3><p class="muted">${t('rank_ladder_desc')}</p><div class="level-list">${rankMilestones().map(([xp, label]) => `<div class="level-row ${progress.xp >= xp ? 'done' : ''}"><div class="level-num">${xp}</div><div><strong>${esc(label)}</strong><div class="muted">${progress.xp >= xp ? t('rank_reached') : `${xp - progress.xp}${t('rank_xp_remaining')}`}</div></div></div>`).join("")}</div></div>`;
}
function renderProfile() {
  const next = nextLevelId();
  const focus = focusSkill();
  const focusLevel = focus ? nextLevelForSkill(focus.id) : null;
  const focusText = focus ? `${t('profile_focus_area')}${esc(focus.name)} (${focus.pct}%)${focusLevel ? ` · ${t('skills_practice_next')}${esc(levels[focusLevel].title)}` : ''}` : t('profile_all_skills_mastered');
  app.innerHTML = shell(`<div class="section-title"><h2>${t('title_profile')}</h2><button class="ghost" onclick="resetProgress()">${t('reset_progress')}</button></div><div class="grid two"><div class="card"><h3>${currentLevelName()}</h3><p class="muted">${t('profile_xp')}${progress.xp}</p><div class="feedback"><strong>${t('profile_rank_progress')}</strong> ${xpProgressSummary()}</div><p class="muted">${t('profile_completed_levels')}${progress.completed.length} / ${Object.keys(levels).length}</p><p class="muted">${t('profile_daily_streak')}${progress.streak}</p><p class="muted">${next ? `${t('profile_next_recommended')}${esc(levels[next].title)}` : t('profile_all_completed')}</p><div class="feedback"><strong>${t('profile_skill_focus')}</strong> ${focusText}</div><div class="actions"><button onclick="routeNextLevel()">${next ? t('profile_continue') : t('profile_review')}</button></div><h3>${t('skill_tree')}</h3>${renderSkillsMini()}</div><div class="card"><h3>${t('badges')}</h3><div class="badges">${badges.map(([id, name, desc]) => `<div class="badge ${progress.badges.includes(id) ? '' : 'locked'}"><strong>${esc(name)}</strong><p class="muted">${esc(desc)}</p></div>`).join("")}</div></div></div>${renderRankLadder()}${renderResearchArtifacts()}${renderMasteryTranscript()}<div class="card" style="margin-top:16px"><h3>${t('progress_backup')}</h3><p class="muted">${t('backup_desc')}</p><textarea id="progressPayload" placeholder="Progress JSON appears here after export"></textarea><div class="actions"><button onclick="exportProgress()">${t('export_progress')}</button><button class="secondary" onclick="importProgress()">${t('import_progress')}</button></div><div id="progressStatus" role="status" aria-live="polite"></div></div>`);
}
function exportProgress() {
  const target = document.getElementById("progressPayload");
  const status = document.getElementById("progressStatus");
  if (!target || !status) return;
  target.value = JSON.stringify(progress, null, 2);
  status.innerHTML = `<div class="feedback ok">${t('backup_exported')}</div>`;
}
function importProgress() {
  const target = document.getElementById("progressPayload");
  const status = document.getElementById("progressStatus");
  if (!target || !status) return;
  if (target.value.length > 10000) {
    status.innerHTML = `<div class="feedback bad">${t('backup_too_large')}</div>`;
    return;
  }
  try {
    progress = normalizeProgress(JSON.parse(target.value));
    saveProgress();
    renderProfile();
  } catch {
    status.innerHTML = `<div class="feedback bad">${t('backup_invalid')}</div>`;
  }
}
function resetProgress() { if (confirm(t('backup_reset_confirm'))) { progress = initialProgress(); saveProgress(); renderProfile(); } }
function noteTags(id) {
  const tags = {
    panel: ["Structure", "Design"],
    ovb: ["Assumptions", "Threats"],
    fe: ["Identification", "Method"],
    cluster: ["Inference", "Method"],
    po: ["Theory", "Causal"],
    did: ["Causal", "Method"],
    parallel: ["Assumptions", "Diagnostic"],
    event: ["Diagnostic", "Specification"]
  };
  return tags[id] || ["Method", "Practice"];
}
function noteQuestion(id) {
  const questions = {
    panel: "What are the unit and time identifiers, and are there duplicate rows?",
    ovb: "Which omitted factor could move both treatment and outcome?",
    fe: "What within-unit change identifies the coefficient?",
    cluster: "At what level could shocks or treatment assignment be correlated?",
    po: "What counterfactual outcome is missing for treated units?",
    did: "What is the treated group's counterfactual trend?",
    parallel: "What evidence supports or threatens parallel trends?",
    event: "Which leads test pre-trends and which lags show dynamics?"
  };
  return questions[id] || "What assumption makes this estimate credible?";
}
function noteGlossaryTerms(id) {
  const terms = {
    panel: ["Unit-time key", "Merge key"],
    ovb: ["Within variation"],
    fe: ["Within variation", "Clustered SE"],
    cluster: ["Clustered SE"],
    po: ["ATT"],
    did: ["ATT", "Parallel trends", "Staggered adoption"],
    parallel: ["Parallel trends", "Pre-trend", "Event-study lead"],
    event: ["Event-study lead", "Pre-trend", "Parallel trends"]
  };
  return terms[id] || [];
}
function renderGlossaryTermTags(id) {
  const terms = noteGlossaryTerms(id);
  return terms.length ? `<p class="muted"><strong>${t('misc_glossary')}</strong> ${terms.map(term => `<span class="tag">${esc(term)}</span>`).join("")}</p>` : "";
}
function renderPracticeTags(id) {
  const related = Object.entries(levels).filter(([, level]) => level.skills.includes(id)).slice(0, 3);
  return related.length ? `<p class="muted"><strong>Practice in:</strong> ${related.map(([levelId, level]) => `<button class="ghost" onclick="route('level','${levelId}')">${esc(level.title)}</button>`).join(" ")}</p>` : "";
}
function renderNotes() { app.innerHTML = shell(`<div class="section-title"><h2>${t('title_method_notes')}</h2><span class="muted">${t('sub_method_notes')}</span></div><div class="grid two">${notes.map(([id, title, body]) => `<article class="card note" data-label="${esc(id.toUpperCase())}"><h3>${esc(title)}</h3><p class="muted">${esc(body)}</p><p class="muted"><strong>${t('note_common_pitfall')}</strong> ${esc(notePitfall(id))}</p><p class="muted"><strong>${t('note_ask_yourself')}</strong> ${esc(noteQuestion(id))}</p>${renderGlossaryTermTags(id)}${renderPracticeTags(id)}<div class="tags">${noteTags(id).map(tag => `<span class="tag">${esc(tag)}</span>`).join("")}</div></article>`).join("")}</div>`); }
function renderGlossary() { app.innerHTML = shell(`<div class="section-title"><h2>${t('title_glossary')}</h2><span class="muted">${t('sub_glossary')}</span></div><div class="grid two">${glossary.map(([term, definition]) => `<article class="card note"><h3>${esc(term)}</h3><p class="muted">${esc(definition)}</p></article>`).join("")}</div>`); }
function renderTools() { app.innerHTML = shell(`<div class="section-title"><h2>${t('title_toolkit')}</h2><span class="muted">${t('sub_toolkit')}</span></div><div class="card"><h3>${t('method_tool_map')}</h3><table class="table"><thead><tr><th>Method task</th><th>R path</th><th>Python path</th><th>Research reminder</th></tr></thead><tbody>${methodToolMatrix.map(([task, rPath, pyPath, reminder]) => `<tr><td><strong>${esc(task)}</strong></td><td>${esc(rPath)}</td><td>${esc(pyPath)}</td><td>${esc(reminder)}</td></tr>`).join("")}</tbody></table></div><div class="card" style="margin-top:16px"><h3>${t('code_recipes')}</h3><p class="muted">Copyable patterns for common empirical tasks. Treat them as templates, not substitutes for research design.</p><table class="table"><thead><tr><th>Recipe</th><th>Pattern</th><th>Use when</th></tr></thead><tbody>${codeRecipes.map(([name, pattern, use]) => `<tr><td><strong>${esc(name)}</strong></td><td><code>${esc(pattern)}</code></td><td>${esc(use)}</td></tr>`).join("")}</tbody></table></div><table class="table card" style="margin-top:16px"><thead><tr><th>Package</th><th>Language</th><th>Use case</th><th>Watch out</th></tr></thead><tbody>${tools.map(([name, lang, use, caveat]) => `<tr><td><strong>${esc(name)}</strong></td><td>${esc(lang)}</td><td>${esc(use)}</td><td>${esc(caveat)}</td></tr>`).join("")}</tbody></table>`); }
function render() {
  const [view = "home", id] = location.hash.replace(/^#/, "").split("/");
  if (view === "quests") return renderQuests();
  if (view === "quest") return renderQuest(id);
  if (view === "level") return renderLevel(id);
  if (view === "skills") return renderSkills();
  if (view === "notes") return renderNotes();
  if (view === "glossary") return renderGlossary();
  if (view === "tools") return renderTools();
  if (view === "profile") return renderProfile();
  return renderHome();
}
window.route = route; window.routeNextLevel = routeNextLevel; window.checkMCQ = checkMCQ; window.checkFill = checkFill; window.checkCode = checkCode; window.checkMemo = checkMemo; window.selectOrdering = selectOrdering; window.resetOrdering = resetOrdering; window.checkOrdering = checkOrdering; window.handleOptionKey = handleOptionKey; window.collectPassedLevel = collectPassedLevel; window.completeAndContinue = completeAndContinue; window.exportProgress = exportProgress; window.importProgress = importProgress; window.resetProgress = resetProgress; window.toggleTheme = toggleTheme; window.toggleLang = toggleLang;
window.addEventListener("hashchange", render);
render();


})();
