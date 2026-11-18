// server/utils/achievementEngine.js
// Each badge has a numeric target, so the profile page can show progress bars ("2 of 3 articles").

const BADGE_RULES = [
  {
    id: 'first_step',
    title: '🚀 Pioneer Contributor',
    description: 'Unlocked Achievement Section by publishing the 1st approved post!',
    unit: 'approved posts',
    target: 1,
    value: ({ totalApproved }) => totalApproved,
  },
  {
    id: 'tech_writer',
    title: '✍️ Prolific Tech Writer',
    description: 'Published 3+ coding articles or study blogs.',
    unit: 'articles',
    target: 3,
    value: ({ articlesCount }) => articlesCount,
  },
  {
    id: 'resource_hero',
    title: '📚 Campus Resource Hero',
    description: 'Shared 5+ free academic slides, suggestions, or courses.',
    unit: 'resources and courses',
    target: 5,
    value: ({ resourcesCount, coursesCount }) => resourcesCount + coursesCount,
  },
  {
    id: 'project_innovator',
    title: '💻 Project Innovator',
    description: 'Showcased 2+ projects on Campus Resources Hub.',
    unit: 'projects',
    target: 2,
    value: ({ projectsCount }) => projectsCount,
  },
  {
    id: 'community_star',
    title: '⭐ Community Star',
    description: 'Earned 25+ Love reacts across shared contributions.',
    unit: 'love reacts',
    target: 25,
    value: ({ totalLoves }) => totalLoves,
  },
];

// Requirement: Arrow Function + Array Methods (.filter, .reduce, .map) + Destructuring
export const calculateUserAchievements = (approvedPosts = []) => {
  const stats = approvedPosts.reduce(
    (acc, { type, lovedBy = [], views = 0 }) => {
      acc.totalApproved += 1;
      acc.totalLoves += lovedBy.length;
      acc.totalViews += views;
      if (type === 'article') acc.articlesCount += 1;
      if (type === 'resource') acc.resourcesCount += 1;
      if (type === 'course') acc.coursesCount += 1;
      if (type === 'project') acc.projectsCount += 1;
      return acc;
    },
    {
      totalApproved: 0,
      articlesCount: 0,
      resourcesCount: 0,
      coursesCount: 0,
      projectsCount: 0,
      totalLoves: 0,
      totalViews: 0,
    }
  );

  // One approved post unlocks the Achievement section
  const isAchievementUnlocked = stats.totalApproved >= 1;

  const toBadge = ({ id, title, description, unit, target, value }) => ({
    id,
    title,
    description,
    unit,
    target,
    current: Math.min(value(stats), target),
  });

  const unlockedBadges = BADGE_RULES.filter(({ value, target }) => value(stats) >= target).map(toBadge);
  const lockedBadges = BADGE_RULES.filter(({ value, target }) => value(stats) < target).map(toBadge);

  return { isAchievementUnlocked, stats, unlockedBadges, lockedBadges };
};