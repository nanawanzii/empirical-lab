const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appPath = path.join(__dirname, '..', 'app.js');

function createHarness(initialHash = '', initialStorage = '{}') {
  const elements = {
    app: { innerHTML: '' },
    feedback: { innerHTML: '' },
    answer: { value: '' },
    progressPayload: { value: '' },
    progressStatus: { innerHTML: '' }
  };
  let stored = initialStorage;
  const context = {
    document: {
      getElementById: (id) => elements[id] || (elements[id] = { innerHTML: '', value: '' })
    },
    localStorage: {
      getItem: () => stored,
      setItem: (_key, value) => { stored = value; }
    },
    location: { hash: initialHash },
    window: { addEventListener: () => {} },
    confirm: () => true
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(appPath, 'utf8'), context);
  return { context, elements, getStored: () => stored };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseStored(stored) {
  return JSON.parse(stored);
}

function testHomeAndBasicProgress() {
  const { context, elements, getStored } = createHarness();
  assert(elements.app.innerHTML.includes('Game-based empirical economics training'), 'home did not render');
  assert(typeof context.complete === 'undefined', 'complete leaked globally');
  context.window.completeAndContinue('final-boss');
  assert(getStored() === '{}', 'locked completion changed progress');
  context.window.checkMCQ('fe-1', 0);
  assert(elements.feedback.innerHTML.includes('Collect XP'), 'correct answer did not enable XP collection');
  context.window.completeAndContinue('fe-1');
  const progress = parseStored(getStored());
  assert(progress.completed.includes('fe-1'), 'fe-1 not completed');
  assert(progress.xp === 30, 'unexpected XP after fe-1');
  const wrong = createHarness();
  wrong.context.window.checkMCQ('fe-1', 1);
  assert(wrong.elements.feedback.innerHTML.includes('Review: Panel data repeats'), 'wrong MCQ feedback should include concept reminder');
  const fill = createHarness('#level/did-2', JSON.stringify({ completed: ['fe-boss', 'did-1'], badges: [], xp: 0, streak: 0, lastDay: null }));
  fill.elements.answer.value = '8';
  fill.context.window.checkFill('did-2');
  assert(fill.elements.feedback.innerHTML.includes('Review: DID subtracts'), 'wrong fill feedback should include concept reminder');
}

function testCodeValidationRejectsComments() {
  const { context, elements } = createHarness();
  elements.answer.value = '/* page.wait_for_selector("table") */';
  context.window.checkCode('data-4');
  assert(!elements.feedback.innerHTML.includes('Collect XP'), 'block-comment code passed validation');
  elements.answer.value = '""" page.wait_for_selector("table") """';
  context.window.checkCode('data-4');
  assert(!elements.feedback.innerHTML.includes('Collect XP'), 'triple-string code passed validation');
}

function testOrderingChallenge() {
  const initial = JSON.stringify({ completed: ['fe-boss', 'did-boss', 'data-boss'], badges: [], xp: 0, streak: 0, lastDay: null });
  const { context, elements, getStored } = createHarness('#level/workflow-1', initial);
  assert(elements.app.innerHTML.includes('Order the Empirical Workflow'), 'ordering level did not render');
  [0, 1, 2, 3, 4, 5].forEach(index => context.window.selectOrdering('workflow-1', index));
  context.window.checkOrdering('workflow-1');
  assert(elements.feedback.innerHTML.includes('Collect XP'), 'correct ordering did not pass');
  context.window.completeAndContinue('workflow-1');
  const progress = parseStored(getStored());
  assert(progress.completed.includes('workflow-1'), 'workflow progress not saved');
}

function testCheckerTypeGuards() {
  const initial = JSON.stringify({ completed: ['fe-boss', 'did-boss', 'data-boss', 'workflow-1'], badges: [], xp: 0, streak: 0, lastDay: null });
  const { context, elements, getStored } = createHarness('#level/final-boss', initial);
  context.window.checkMCQ('final-boss');
  context.window.completeAndContinue('final-boss');
  let progress = parseStored(getStored());
  assert(!progress.completed.includes('final-boss'), 'MCQ bypass completed final boss');
  elements.answer.value = 'raw panel treatment parallel event cluster memo '.repeat(4);
  context.window.checkMemo('final-boss');
  assert(elements.feedback.innerHTML.includes('Collect XP'), 'valid final memo did not pass');
  context.window.completeAndContinue('final-boss');
  progress = parseStored(getStored());
  assert(progress.completed.includes('final-boss'), 'valid final memo did not complete');
}

function testInvalidLevelRouteDoesNotCrash() {
  const { context, elements } = createHarness('#level/not-a-real-level');
  assert(elements.app.innerHTML.length > 0, 'invalid level route rendered empty app');
  context.window.route('level', 'also-not-real');
  assert(true, 'invalid route did not crash');
}

function testHomeKpisAndLockedGuidance() {
  const { elements } = createHarness();
  assert(elements.app.innerHTML.includes('<strong>21</strong>'), 'home level KPI should reflect current level count');
  assert(elements.app.innerHTML.includes('<strong>4</strong>'), 'home boss KPI should reflect current boss count');
  assert(elements.app.innerHTML.includes('MVP time'), 'home should show total MVP time estimate');
  assert(elements.app.innerHTML.includes('Remaining'), 'home should show remaining time estimate');
  assert(elements.app.innerHTML.includes('Next level'), 'home should show next-level time estimate');
  assert(elements.app.innerHTML.includes('Locked: Complete the Fixed Effects Lab boss.'), 'locked DID quest should explain prerequisite');
}

function testCodeFailureShowsExpectedStructure() {
  const initial = JSON.stringify({ completed: ['fe-1', 'fe-2'], badges: [], xp: 0, streak: 0, lastDay: null });
  const { context, elements } = createHarness('#level/fe-3', initial);
  elements.answer.value = 'feols(y ~ x | firm_id, data = df)';
  context.window.checkCode('fe-3');
  assert(elements.feedback.innerHTML.includes('Expected structure'), 'code failure should include expected structure guidance');
}

function testContinueRoutesToNextUnlockedLevel() {
  const initial = JSON.stringify({ completed: ['fe-1', 'fe-2'], badges: [], xp: 60, streak: 1, lastDay: null });
  const { context, elements } = createHarness('', initial);
  assert(elements.app.innerHTML.includes('Next up: Two-Way Fixed Effects'), 'home should show next recommended level');
  context.window.routeNextLevel();
  assert(context.location.hash === 'level/fe-3', 'continue should route to next unlocked incomplete level');
}

function testProgressExportImport() {
  const initial = JSON.stringify({ completed: ['fe-1'], badges: ['panel-builder'], xp: 30, streak: 1, lastDay: '2026-06-12' });
  const { context, elements, getStored } = createHarness('#profile', initial);
  assert(elements.app.innerHTML.includes('Progress Backup'), 'profile should render progress backup controls');
  context.window.exportProgress();
  assert(elements.progressPayload.value.includes('fe-1'), 'export should write current progress JSON');
  elements.progressPayload.value = JSON.stringify({ completed: ['fe-1', 'fe-1', 'fake-level'], badges: ['panel-builder', 'panel-builder', 'fake-badge'], xp: 0, streak: 2, lastDay: '2026-06-12' });
  context.window.importProgress();
  const imported = parseStored(getStored());
  assert(imported.completed.includes('fe-1'), 'valid completed level should import');
  assert(imported.completed.filter(id => id === 'fe-1').length === 1, 'duplicate completed levels should be deduped');
  assert(!imported.completed.includes('fake-level'), 'invalid completed level should be filtered');
  assert(imported.badges.filter(id => id === 'panel-builder').length === 1, 'duplicate badges should be deduped');
  assert(!imported.badges.includes('fake-badge'), 'invalid badge should be filtered');
  assert(imported.xp >= 30, 'import should derive at least earned XP from completed levels');
  elements.progressPayload.value = JSON.stringify({ completed: ['fe-boss'], badges: [], xp: 0, streak: 2, lastDay: '2026-06-12' });
  context.window.importProgress();
  const derivedBadge = parseStored(getStored());
  assert(derivedBadge.badges.includes('fe-apprentice'), 'completed boss levels should derive their badges on import');
  elements.progressPayload.value = JSON.stringify({ completed: Array(200).fill('fe-1'), badges: Array(200).fill('panel-builder'), xp: 0, streak: 2, lastDay: '2026-06-12' });
  context.window.importProgress();
  const capped = parseStored(getStored());
  assert(capped.completed.length === 1, 'oversized completed arrays should still normalize to unique valid IDs');
  assert(capped.badges.length === 1, 'oversized badge arrays should still normalize to unique valid IDs');
  elements.progressPayload.value = JSON.stringify({ completed: [], badges: [], xp: 999999, streak: 2, lastDay: '2026-06-12' });
  context.window.importProgress();
  const xpCapped = parseStored(getStored());
  assert(xpCapped.xp === 0, 'imported XP should be derived from completed levels, not trusted directly');
  elements.progressPayload.value = '{"completed":[' + '"fe-1",'.repeat(6000) + '"fe-1"]}';
  context.window.importProgress();
  assert(elements.progressStatus.innerHTML.includes('too large'), 'oversized progress JSON should be rejected before parsing');
}

function testInlineMethodNoteAppearsOnLevels() {
  const { elements } = createHarness('#level/fe-1');
  assert(elements.app.innerHTML.includes('Quick method note'), 'level should include inline method note details');
  assert(elements.app.innerHTML.includes('Panel Data Structure'), 'FE first level should show panel data note inline');
  assert(elements.app.innerHTML.includes('Ask yourself:'), 'inline method note should include self-check question');
  assert(elements.app.innerHTML.includes('unit and time identifiers'), 'panel note should ask about unit-time identifiers');
  assert(elements.app.innerHTML.includes('Glossary:'), 'inline method note should include glossary links');
  assert(elements.app.innerHTML.includes('Unit-time key'), 'inline panel note should reference unit-time key glossary term');
}

function testMethodNotesUseSemanticTags() {
  const { elements } = createHarness('#notes');
  assert(elements.app.innerHTML.includes('Structure'), 'panel note should include semantic tag');
  assert(elements.app.innerHTML.includes('Diagnostic'), 'diagnostic notes should include semantic tag');
  assert(elements.app.innerHTML.includes('Ask yourself:'), 'method notes should show self-check questions');
  assert(elements.app.innerHTML.includes('What evidence supports or threatens parallel trends?'), 'parallel-trends note should include diagnostic question');
  assert(elements.app.innerHTML.includes('Glossary:'), 'method notes should show glossary term tags');
  assert(elements.app.innerHTML.includes('Event-study lead'), 'method notes should link event study to glossary term');
  assert(elements.app.innerHTML.includes('Staggered adoption'), 'method notes should link DID to staggered adoption term');
  assert(elements.app.innerHTML.includes('Practice in:'), 'method notes should link concepts to practice levels');
  assert(elements.app.innerHTML.includes('Recognize Panel Data'), 'panel method note should link to practice level');
  assert(!elements.app.innerHTML.includes('Math/Stats</span><span class="tag">Identification'), 'notes should not all use generic repeated tags');
}

function testToolkitShowsCaveats() {
  const { elements } = createHarness('#tools');
  assert(elements.app.innerHTML.includes('Watch out'), 'toolkit should include caveat column');
  assert(elements.app.innerHTML.includes('Slower than APIs'), 'Playwright caveat should explain scraping tradeoff');
  assert(elements.app.innerHTML.includes('verify outputs against known references'), 'StatsPAI caveat should encourage validation');
}

function testToolkitShowsMethodToolMap() {
  const { elements } = createHarness('#tools');
  assert(elements.app.innerHTML.includes('Method → tool map'), 'toolkit should show method-to-tool map');
  assert(elements.app.innerHTML.includes('Two-way fixed effects'), 'tool map should include fixed effects');
  assert(elements.app.innerHTML.includes('Validate unit-time keys'), 'tool map should include research reminder');
}

function testToolkitShowsCodeRecipes() {
  const { elements } = createHarness('#tools');
  assert(elements.app.innerHTML.includes('Code recipes'), 'toolkit should show code recipe section');
  assert(elements.app.innerHTML.includes('feols(y ~ treatment | unit + year'), 'code recipes should include TWFE pattern');
  assert(elements.app.innerHTML.includes('page.wait_for_selector'), 'code recipes should include Playwright pattern');
}

function testQuestRowsShowChallengeTypeAndXp() {
  const { elements } = createHarness('#quest/fe');
  assert(elements.app.innerHTML.includes('Concept Check'), 'quest rows should show challenge type');
  assert(elements.app.innerHTML.includes('Code Challenge'), 'quest rows should identify code challenges before users open them');
  assert(elements.app.innerHTML.includes('35 XP'), 'quest rows should show XP reward');
}

function testQuestShowsNextUnlockedLevel() {
  const initial = JSON.stringify({ completed: ['fe-1', 'fe-2'], badges: [], xp: 60, streak: 1, lastDay: null });
  const { elements } = createHarness('#quest/fe', initial);
  assert(elements.app.innerHTML.includes('Next up:</strong> Two-Way Fixed Effects'), 'quest view should show next unlocked level');
  assert(elements.app.innerHTML.includes('<span class="tag">Next</span>'), 'next level row should have Next tag');
}

function testMemoLevelsShowChecklist() {
  const initial = JSON.stringify({ completed: ['fe-1', 'fe-2', 'fe-3', 'fe-4'], badges: [], xp: 0, streak: 0, lastDay: null });
  const { elements } = createHarness('#level/fe-boss', initial);
  assert(elements.app.innerHTML.includes('Memo checklist'), 'memo levels should show checklist');
  assert(elements.app.innerHTML.includes('design → assumption → estimate → interpretation'), 'memo checklist should teach narrative structure');
  assert(elements.app.innerHTML.includes('<li>within</li>'), 'memo checklist should list required concepts');
}

function testMemoSuccessShowsMethodHint() {
  const initial = JSON.stringify({ completed: ['fe-1', 'fe-2', 'fe-3', 'fe-4'], badges: [], xp: 0, streak: 0, lastDay: null });
  const { context, elements } = createHarness('#level/fe-boss', initial);
  elements.answer.value = 'This firm year design uses firm and year fixed effects. The within variation identifies changes over time, and we cluster standard errors at firm level to interpret uncertainty clearly.';
  context.window.checkMemo('fe-boss');
  assert(elements.feedback.innerHTML.includes('Method hint'), 'passing memo should show method hint');
  assert(elements.feedback.innerHTML.includes('within-unit identifying variation'), 'FE boss method hint should explain identifying variation');
  elements.answer.value = 'firm year within cluster '.repeat(2000);
  context.window.checkMemo('fe-boss');
  assert(elements.feedback.innerHTML.includes('Memo is too long'), 'oversized memo should be rejected');
}

function testSuggestedPaceAppears() {
  const { elements: questElements } = createHarness('#quest/fe');
  assert(questElements.app.innerHTML.includes('3-5 min'), 'quest rows should show short concept-check pace');
  assert(questElements.app.innerHTML.includes('8-12 min'), 'quest rows should show code-challenge pace');
  assert(questElements.app.innerHTML.includes('Estimated time: 37-57 min total'), 'quest header should show total estimated time');
  assert(questElements.app.innerHTML.includes('37-57 min remaining'), 'quest header should show remaining estimated time');
  const { elements: homeElements } = createHarness();
  assert(homeElements.app.innerHTML.includes('37-57 min total'), 'quest cards should show total estimated time');
  assert(homeElements.app.innerHTML.includes('37-57 min remaining'), 'quest cards should show remaining estimated time');
  const { elements: levelElements } = createHarness('#level/fe-3', JSON.stringify({ completed: ['fe-1', 'fe-2'], badges: [], xp: 0, streak: 0, lastDay: null }));
  assert(levelElements.app.innerHTML.includes('Suggested pace: 8-12 min'), 'level sidebar should show suggested pace');
}

function testProfileShowsSkillFocus() {
  const initial = JSON.stringify({ completed: ['fe-1', 'fe-2'], badges: [], xp: 60, streak: 1, lastDay: null });
  const { elements } = createHarness('#profile', initial);
  assert(elements.app.innerHTML.includes('Skill focus:'), 'profile should show skill focus block');
  assert(elements.app.innerHTML.includes('Focus area:'), 'profile should name a focus area');
  assert(elements.app.innerHTML.includes('Practice next:'), 'profile should suggest a practice level for the focus skill when available');
}

function testQuestCardsShowUnlockStatusTags() {
  const fresh = createHarness();
  assert(fresh.elements.app.innerHTML.includes('Start here'), 'fresh home should label first quest as start here');
  const afterFeBoss = JSON.stringify({ completed: ['fe-boss'], badges: [], xp: 0, streak: 0, lastDay: null });
  const unlocked = createHarness('', afterFeBoss);
  assert(unlocked.elements.app.innerHTML.includes('Newly unlocked'), 'newly available advanced quest should be labeled');
}

function testMethodNotesShowCommonPitfalls() {
  const notesPage = createHarness('#notes');
  assert(notesPage.elements.app.innerHTML.includes('Common pitfall:'), 'method notes should show pitfall guidance');
  assert(notesPage.elements.app.innerHTML.includes('time-varying confounders'), 'OVB pitfall should mention time-varying confounders');
  const levelPage = createHarness('#level/fe-1');
  assert(levelPage.elements.app.innerHTML.includes('Common pitfall:'), 'inline method notes should include pitfall guidance');
}

function testHomeShowsQuestProgressMicrobars() {
  const initial = JSON.stringify({ completed: ['fe-1', 'fe-2'], badges: [], xp: 60, streak: 1, lastDay: null });
  const { elements } = createHarness('', initial);
  assert(elements.app.innerHTML.includes('Quest progress'), 'home should show quest progress section');
  assert(elements.app.innerHTML.includes('Fixed Effects Lab'), 'quest progress should include fixed effects quest');
  assert(elements.app.innerHTML.includes('2/5 levels'), 'quest progress should show completed/total levels');
  assert(elements.app.innerHTML.includes('31-47 min remaining'), 'quest progress should show remaining time after completed levels');
  assert(elements.app.innerHTML.includes('0/8 levels'), 'quest progress should show locked quest level count');
  assert(elements.app.innerHTML.includes('locked'), 'quest progress should mark locked quests');
}

function testQuestCardsShowProgressClasses() {
  const partial = JSON.stringify({ completed: ['fe-1', 'fe-2'], badges: [], xp: 60, streak: 1, lastDay: null });
  const partialView = createHarness('', partial);
  assert(partialView.elements.app.innerHTML.includes('quest-in-progress'), 'partial quest should get in-progress visual class');
  assert(partialView.elements.app.innerHTML.includes('data-progress="40"'), 'partial quest card should expose progress percent');
  const mastered = JSON.stringify({ completed: ['fe-1', 'fe-2', 'fe-3', 'fe-4', 'fe-boss'], badges: [], xp: 0, streak: 0, lastDay: null });
  const masteredView = createHarness('', mastered);
  assert(masteredView.elements.app.innerHTML.includes('quest-mastered'), 'completed quest should get mastered visual class');
}

function testLockedQuestRowsShowPrerequisiteHint() {
  const { elements } = createHarness('#quest/fe');
  assert(elements.app.innerHTML.includes('Unlock by completing: Recognize Panel Data'), 'locked level rows should explain the prior level requirement');
}

function testSkillTreeShowsPracticePaths() {
  const initial = JSON.stringify({ completed: ['fe-1', 'fe-2'], badges: [], xp: 60, streak: 1, lastDay: null });
  const { elements } = createHarness('#skills', initial);
  assert(elements.app.innerHTML.includes('related levels complete'), 'skill tree should show related level counts');
  assert(elements.app.innerHTML.includes('Practice next:'), 'skill tree should show next practice level when available');
  assert(elements.app.innerHTML.includes('XP remaining'), 'skill tree should show XP remaining in mini bars');
  assert(elements.app.innerHTML.includes('Focus skill'), 'skill tree should visually mark the focus skill');
  assert(elements.app.innerHTML.includes('focus-skill'), 'skill tree should apply focus-skill class to highlighted card');
  assert(elements.app.innerHTML.includes('Two-Way Fixed Effects'), 'skill tree should name a concrete next practice level');
}

function testRankProgressSummaryAppears() {
  const initial = JSON.stringify({ completed: ['fe-1', 'fe-2'], badges: [], xp: 60, streak: 1, lastDay: null });
  const home = createHarness('', initial);
  assert(home.elements.app.innerHTML.includes('Rank progress:'), 'home should show rank progress summary');
  assert(home.elements.app.innerHTML.includes('40 XP to Level 2'), 'home should show XP gap to next rank');
  assert(home.elements.app.innerHTML.includes('Pipeline progress: 2 / 21 levels completed'), 'home should show completed level count');
  const profile = createHarness('#profile', initial);
  assert(profile.elements.app.innerHTML.includes('Rank progress:'), 'profile should show rank progress summary');
  assert(profile.elements.app.innerHTML.includes('Rank ladder'), 'profile should show rank ladder');
  assert(profile.elements.app.innerHTML.includes('Level 2 · Data Cleaner'), 'rank ladder should show next rank');
  assert(profile.elements.app.innerHTML.includes('40 XP remaining'), 'rank ladder should show XP remaining');
}

function testProfileShowsMasteryTranscript() {
  const initial = JSON.stringify({ completed: ['fe-boss'], badges: ['fe-apprentice'], xp: 100, streak: 1, lastDay: null });
  const { elements } = createHarness('#profile', initial);
  assert(elements.app.innerHTML.includes('Mastery transcript'), 'profile should show mastery transcript');
  assert(elements.app.innerHTML.includes('Mastered · Fixed effects workflow'), 'completed boss should show mastered workflow');
  assert(elements.app.innerHTML.includes('Locked · Policy evaluation workflow'), 'incomplete boss should remain locked in transcript');
  assert(elements.app.innerHTML.includes('within-unit variation'), 'transcript should summarize empirical skill evidence');
}

function testProfileShowsResearchArtifacts() {
  const empty = createHarness('#profile');
  assert(empty.elements.app.innerHTML.includes('Complete boss projects to build a portfolio'), 'empty profile should explain research artifacts');
  const initial = JSON.stringify({ completed: ['fe-boss'], badges: ['fe-apprentice'], xp: 100, streak: 1, lastDay: null });
  const { elements } = createHarness('#profile', initial);
  assert(elements.app.innerHTML.includes('Research artifacts'), 'profile should show research artifacts section');
  assert(elements.app.innerHTML.includes('Firm-Year Regression · 100 XP'), 'completed boss should appear as research artifact');
  assert(elements.app.innerHTML.includes('Review memo'), 'research artifact should link back to memo review');
}

function testCompletedLevelsShowReviewMode() {
  const completedMcq = createHarness('#level/fe-1', JSON.stringify({ completed: ['fe-1'], badges: [], xp: 30, streak: 1, lastDay: null }));
  assert(completedMcq.elements.app.innerHTML.includes('Review mode:'), 'completed MCQ level should show review mode banner');
  assert(completedMcq.elements.app.innerHTML.includes('Correct answer: firm_id and year'), 'review mode should show MCQ answer');
  const completedMemo = createHarness('#level/fe-boss', JSON.stringify({ completed: ['fe-1', 'fe-2', 'fe-3', 'fe-4', 'fe-boss'], badges: [], xp: 0, streak: 1, lastDay: null }));
  assert(completedMemo.elements.app.innerHTML.includes('Completed memo'), 'completed memo should show memo review summary');
}

function testHomeShowsLearningPathway() {
  const { elements } = createHarness();
  assert(elements.app.innerHTML.includes('Learning pathway'), 'home should show learning pathway');
  assert(elements.app.innerHTML.includes('Empirical work is sequential'), 'pathway should explain sequencing');
  assert(elements.app.innerHTML.includes('1. Fixed Effects Lab'), 'pathway should start with fixed effects');
  assert(elements.app.innerHTML.includes('4. Final Boss · locked'), 'pathway should show locked final step');
}

function testQuestHeaderShowsMethodReminder() {
  const didProgress = JSON.stringify({ completed: ['fe-boss'], badges: [], xp: 100, streak: 1, lastDay: null });
  const didQuest = createHarness('#quest/did', didProgress);
  assert(didQuest.elements.app.innerHTML.includes('Method reminder:'), 'quest header should show method reminder');
  assert(didQuest.elements.app.innerHTML.includes('Why this quest:'), 'quest should explain why it follows prior work');
  assert(didQuest.elements.app.innerHTML.includes('policy timing and counterfactual trends'), 'DID quest context should explain causal progression');
  assert(didQuest.elements.app.innerHTML.includes('parallel trends'), 'DID reminder should mention parallel trends');
  const dataProgress = JSON.stringify({ completed: ['fe-boss', 'did-boss'], badges: [], xp: 200, streak: 1, lastDay: null });
  const dataQuest = createHarness('#quest/data', dataProgress);
  assert(dataQuest.elements.app.innerHTML.includes('research design, not the other way around'), 'Data quest context should warn against tool-first data collection');
  assert(dataQuest.elements.app.innerHTML.includes('API first'), 'Data quest reminder should prioritize API before scraping');
}

function testGlossaryRendersKeyTerms() {
  const { elements } = createHarness('#glossary');
  assert(elements.app.innerHTML.includes('Glossary'), 'glossary page should render');
  assert(elements.app.innerHTML.includes('Unit-time key'), 'glossary should include panel key term');
  assert(elements.app.innerHTML.includes('Parallel trends'), 'glossary should include DID assumption term');
  assert(elements.app.innerHTML.includes('Staggered adoption'), 'glossary should include staggered DID term');
  assert(elements.app.innerHTML.includes('Pre-trend'), 'glossary should include pre-trend term');
  assert(elements.app.innerHTML.includes('Merge key'), 'glossary should include data workflow term');
  assert(elements.app.innerHTML.includes('Replication package'), 'glossary should include replication package term');
}

function testHomeShowsProgressSnapshot() {
  const initial = JSON.stringify({ completed: ['fe-1', 'fe-2'], badges: [], xp: 60, streak: 1, lastDay: null });
  const { elements } = createHarness('', initial);
  assert(elements.app.innerHTML.includes('Progress Snapshot'), 'home should show progress snapshot');
  assert(elements.app.innerHTML.includes('Your current position in the empirical research pipeline'), 'snapshot should explain pipeline position');
  assert(elements.app.innerHTML.includes('2/5 levels · 40%'), 'snapshot should show quest completion counts and percent');
  assert(elements.app.innerHTML.includes('Output: firm-year regression memo'), 'quest cards should describe output artifact');
}

function testHomeShowsStudyPlan() {
  const { elements: fresh } = createHarness();
  assert(fresh.app.innerHTML.includes('Next study block'), 'home should show next study block');
  assert(fresh.app.innerHTML.includes('Recognize Panel Data'), 'study plan should include first unlocked level');
  assert(fresh.app.innerHTML.includes('Two-Way Fixed Effects'), 'study plan should simulate sequential unlocks within a session');
  assert(fresh.app.innerHTML.includes('Goal: move toward Firm-Year Regression'), 'study plan should show boss-oriented goal');
  assert(fresh.app.innerHTML.includes('Block reward:'), 'study plan should show total XP reward');
  assert(fresh.app.innerHTML.includes('+130 XP'), 'fresh 30-minute study plan should total the included level XP');
  assert(fresh.app.innerHTML.includes('+30 XP'), 'study plan should show per-level XP reward');
  assert(fresh.app.innerHTML.includes('+35 XP'), 'study plan should show higher reward for code levels');
  assert(fresh.app.innerHTML.includes('Estimated block:'), 'study plan should show block estimate');
}

function testHeroCtaShowsXp() {
  const fresh = createHarness();
  assert(fresh.elements.app.innerHTML.includes('Start Your First Research Quest (0 XP)'), 'fresh CTA should show current XP');
  assert(fresh.elements.app.innerHTML.includes('Session cue:'), 'home should show session cue');
  assert(fresh.elements.app.innerHTML.includes('panel design comes before estimation'), 'fresh session cue should explain first empirical step');
  assert(fresh.elements.app.innerHTML.includes('Focus skill:'), 'home should show focus skill callout');
  assert(fresh.elements.app.innerHTML.includes('Panel Data is your focus skill'), 'fresh focus skill should prioritize panel data');
  assert(fresh.elements.app.innerHTML.includes('on pace'), 'fresh focus skill should include pace context');
  assert(fresh.elements.app.innerHTML.includes('Concept mastery'), 'home should label skill bars as concept mastery');
  assert(fresh.elements.app.innerHTML.includes('Track the empirical ideas you are building'), 'home should explain concept mastery');
  assert(fresh.elements.app.innerHTML.includes('XP remaining'), 'home skill bars should show XP remaining');
  const initial = JSON.stringify({ completed: ['fe-1', 'fe-2'], badges: [], xp: 60, streak: 1, lastDay: null });
  const returning = createHarness('', initial);
  assert(returning.elements.app.innerHTML.includes('Continue Research Quest (60 XP)'), 'returning CTA should show current XP');
  assert(returning.elements.app.innerHTML.includes('Continue your current quest: Two-Way Fixed Effects'), 'returning session cue should point to next level');
  assert(returning.elements.app.innerHTML.includes('Practice next: Two-Way Fixed Effects'), 'returning focus skill should suggest concrete practice');
  assert(returning.elements.app.innerHTML.includes('ahead of schedule') || returning.elements.app.innerHTML.includes('on pace') || returning.elements.app.innerHTML.includes('lagging'), 'returning focus skill should include progress comparison');
  const bossDone = createHarness('', JSON.stringify({ completed: ['fe-boss'], badges: ['fe-apprentice'], xp: 100, streak: 1, lastDay: null }));
  assert(bossDone.elements.app.innerHTML.includes('Quest complete. Next quest unlocked'), 'boss completion cue should announce next quest unlock');
}

function testNavShowsNextProgressBadge() {
  const fresh = createHarness();
  assert(fresh.elements.app.innerHTML.includes('0/21 · Next: Recognize Panel Data'), 'nav badge should show first next level');
  const initial = JSON.stringify({ completed: ['fe-1', 'fe-2'], badges: [], xp: 60, streak: 1, lastDay: null });
  const returning = createHarness('#tools', initial);
  assert(returning.elements.app.innerHTML.includes('2/21 · Next: Two-Way Fixed Effects'), 'nav badge should persist outside home with next level');
}

function testQuestShowsBossTarget() {
  const { elements } = createHarness('#quest/fe');
  assert(elements.app.innerHTML.includes('Boss target:'), 'quest header should show boss target');
  assert(elements.app.innerHTML.includes('Output: firm-year regression memo'), 'quest header should show output artifact');
  assert(elements.app.innerHTML.includes('Firm-Year Regression'), 'FE quest should name its boss project');
  assert(elements.app.innerHTML.includes('5 level(s) to boss'), 'fresh FE quest should show remaining levels to boss');
  const partial = JSON.stringify({ completed: ['fe-1', 'fe-2'], badges: [], xp: 60, streak: 1, lastDay: null });
  const partialQuest = createHarness('#quest/fe', partial);
  assert(partialQuest.elements.app.innerHTML.includes('3 level(s) to boss'), 'partial FE quest should update remaining levels to boss');
  assert(elements.app.innerHTML.includes('<span class="tag">Boss target</span>'), 'boss level row should be tagged');
}

function testHomeShowsBossLadder() {
  const { elements } = createHarness();
  assert(elements.app.innerHTML.includes('Boss ladder'), 'home should show boss ladder');
  assert(elements.app.innerHTML.includes('Clear these projects to prove'), 'boss ladder should explain mastery evidence');
  assert(elements.app.innerHTML.includes('Fixed effects workflow'), 'boss ladder should list first workflow');
  assert(elements.app.innerHTML.includes('Policy evaluation workflow'), 'boss ladder should list DID workflow');
}


function testChallengeOptionsExposeKeyboardShortcuts() {
  const mcq = createHarness('#level/fe-1');
  assert(mcq.elements.app.innerHTML.includes('aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"'), 'MCQ options should expose arrow-key shortcuts');
  assert(mcq.elements.app.innerHTML.includes('onkeydown="handleOptionKey(event)"'), 'MCQ options should wire keyboard navigation');
  const ordering = createHarness('#level/workflow-1', JSON.stringify({ completed: ['fe-boss', 'did-boss', 'data-boss'], badges: [], xp: 0, streak: 0, lastDay: null }));
  assert(ordering.elements.app.innerHTML.includes('aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"'), 'ordering options should expose arrow-key shortcuts');
}

function testCodeLevelsShowRelatedRecipe() {
  const feCode = createHarness('#level/fe-3', JSON.stringify({ completed: ['fe-1', 'fe-2'], badges: [], xp: 0, streak: 0, lastDay: null }));
  assert(feCode.elements.app.innerHTML.includes('Related code recipe: R TWFE'), 'R code level should show related recipe');
  assert(feCode.elements.app.innerHTML.includes('feols(y ~ treatment | unit + year'), 'related recipe should show TWFE pattern');
  const dataCode = createHarness('#level/data-4', JSON.stringify({ completed: ['fe-boss', 'did-boss', 'data-1', 'data-2', 'data-3'], badges: [], xp: 0, streak: 0, lastDay: null }));
  assert(dataCode.elements.app.innerHTML.includes('Related code recipe: Playwright table'), 'Playwright level should show related recipe');
}
function testQuestShowsResearchChecklist() {
  const fe = createHarness('#quest/fe');
  assert(fe.elements.app.innerHTML.includes('Research checklist'), 'quest should show research checklist');
  assert(fe.elements.app.innerHTML.includes('Identify unit-time keys'), 'FE checklist should include unit-time keys');
  const didProgress = JSON.stringify({ completed: ['fe-boss'], badges: [], xp: 100, streak: 1, lastDay: null });
  const did = createHarness('#quest/did', didProgress);
  assert(did.elements.app.innerHTML.includes('Check pre-trends'), 'DID checklist should include pre-trends');
  const dataProgress = JSON.stringify({ completed: ['fe-boss', 'did-boss'], badges: [], xp: 200, streak: 1, lastDay: null });
  const data = createHarness('#quest/data', dataProgress);
  assert(data.elements.app.innerHTML.includes('Respect terms, rate limits, and robots guidance'), 'Data checklist should include responsible data acquisition guidance');
  const finalProgress = JSON.stringify({ completed: ['fe-boss', 'did-boss', 'data-boss'], badges: [], xp: 300, streak: 1, lastDay: null });
  const finalQuest = createHarness('#quest/final', finalProgress);
  assert(finalQuest.elements.app.innerHTML.includes('Prepare a replication package trail'), 'Final checklist should include replication package trail');
}

function testQuestShowsConceptMasteryMeter() {
  const progress = JSON.stringify({ completed: ['fe-1', 'fe-2'], badges: [], xp: 60, streak: 1, lastDay: null });
  const { elements } = createHarness('#quest/fe', progress);
  assert(elements.app.innerHTML.includes('Concept mastery:'), 'quest should show concept mastery meter');
  assert(elements.app.innerHTML.includes('Panel Data'), 'concept meter should include panel skill');
  assert(elements.app.innerHTML.includes('67%'), 'concept meter should show partial skill percentage');
  assert(elements.app.innerHTML.includes('Fixed Effects'), 'concept meter should include fixed effects skill');
}

const tests = [
  testHomeAndBasicProgress,
  testCodeValidationRejectsComments,
  testOrderingChallenge,
  testCheckerTypeGuards,
  testInvalidLevelRouteDoesNotCrash,
  testHomeKpisAndLockedGuidance,
  testCodeFailureShowsExpectedStructure,
  testContinueRoutesToNextUnlockedLevel,
  testProgressExportImport,
  testInlineMethodNoteAppearsOnLevels,
  testMethodNotesUseSemanticTags,
  testToolkitShowsCaveats,
  testToolkitShowsMethodToolMap,
  testToolkitShowsCodeRecipes,
  testQuestRowsShowChallengeTypeAndXp,
  testQuestShowsNextUnlockedLevel,
  testMemoLevelsShowChecklist,
  testMemoSuccessShowsMethodHint,
  testSuggestedPaceAppears,
  testProfileShowsSkillFocus,
  testQuestCardsShowUnlockStatusTags,
  testMethodNotesShowCommonPitfalls,
  testHomeShowsQuestProgressMicrobars,
  testQuestCardsShowProgressClasses,
  testLockedQuestRowsShowPrerequisiteHint,
  testSkillTreeShowsPracticePaths,
  testRankProgressSummaryAppears,
  testProfileShowsMasteryTranscript,
  testProfileShowsResearchArtifacts,
  testCompletedLevelsShowReviewMode,
  testHomeShowsLearningPathway,
  testQuestHeaderShowsMethodReminder,
  testGlossaryRendersKeyTerms,
  testHomeShowsProgressSnapshot,
  testHomeShowsStudyPlan,
  testHeroCtaShowsXp,
  testNavShowsNextProgressBadge,
  testQuestShowsBossTarget,
  testHomeShowsBossLadder,
  testChallengeOptionsExposeKeyboardShortcuts,
  testCodeLevelsShowRelatedRecipe,
  testQuestShowsResearchChecklist,
  testQuestShowsConceptMasteryMeter
];

for (const test of tests) {
  test();
  console.log(`PASS ${test.name}`);
}
console.log(`${tests.length} smoke tests passed`);

