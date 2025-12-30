// src/utils/categories.js

export const DEFAULT_CATEGORIES = [
  { id: "profile", label: "/profile/" },
  { id: "forum", label: "/forum/" },
  { id: "employer", label: "/employer/" },
  { id: "readblog", label: "/read-blog/" },
  { id: "question", label: "/question/" },
  { id: "communityProfile", label: "/community/profile/" },
  { id: "user", label: "/user/" },
  { id: "discussions", label: "/discussions/" },
  { id: "snippets", label: "/snippets/" },
  { id: "issues", label: "/issues/" },
  { id: "projects", label: "-/projects" },
  { id: "people", label: "/people/" },
  { id: "ideas", label: "/ideas/" },
  { id: "board", label: "/board/board_topic/" },
  { id: "listing", label: "/listing/" },
  { id: "group", label: "/group/" },
  { id: "topic", label: "/topic/" },
  { id: "services", label: "/services/" },
  { id: "wiki", label: "/wiki/" },
  { id: "posts", label: "/posts/" },
  { id: "blog", label: "/blog/" },
  { id: "forums", label: "/forums/" },
  // Add 'other' manually in logic, no need here
];

export const processUrls = (text, categories) => {
  if (!text) return {};
  
  const urls = text.trim().split(/\r?\n/).filter(u => u.trim() !== "");
  const results = {};

  // Initialize buckets
  categories.forEach(cat => results[cat.id] = []);
  results['other'] = [];

  urls.forEach(url => {
    let lowerUrl = url.toLowerCase();
    let categorized = false;

    for (const cat of categories) {
      if (lowerUrl.includes(cat.label.toLowerCase())) {
        results[cat.id].push(url);
        categorized = true;
        break;
      }
    }

    if (!categorized) {
      results['other'].push(url);
    }
  });

  return results;
};