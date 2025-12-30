// src/utils/categories.js

export const DEFAULT_CATEGORIES = [
  { id: "profile", label: "/profile/" },
  { id: "forum", label: "/forum/" },
  { id: "employer", label: "/employer/" },
  { id: "read_blog", label: "/read-blog/" },
  { id: "path_other", label: "/other/" }, // Renamed ID to avoid conflict with Uncategorized
  { id: "question", label: "/question/" },
  { id: "community_profile", label: "/community/profile/" },
  { id: "user", label: "/user/" },
  { id: "discussions", label: "/discussions/" },
  { id: "u_short", label: "/u/" },
  { id: "snippets", label: "/snippets/" },
  { id: "issues", label: "/issues/" },
  { id: "projects", label: "-/projects" },
  { id: "tab_field", label: "?tab=field_core_pfield" },
  { id: "people", label: "/people/" },
  { id: "ideas", label: "/ideas/" },
  { id: "board_topic", label: "/board/board_topic/" },
  { id: "forum_thread", label: "/forum/thread/" },
  { id: "blogs", label: "/blogs/" },
  { id: "listing", label: "/listing/" },
  { id: "mysite_group", label: "mysite-200-group" },
  { id: "group", label: "/group/" },
  { id: "forums_topic", label: "/forums/topic/" },
  { id: "mn_posts", label: "mn.co/posts/" },
  { id: "member", label: "/member/" },
  { id: "candidate", label: "/candidate/" },
  { id: "author", label: "/author/" },
  { id: "company", label: "/company/" },
  { id: "companies", label: "/companies/" },
  { id: "forums_users", label: "/forums/users/" },
  { id: "classifieds", label: "/classifieds/" },
  { id: "ads", label: "/ads/" },
  { id: "users", label: "/users/" },
  { id: "members", label: "/members/" },
  { id: "topic", label: "/topic/" },
  { id: "services", label: "/services/" },
  { id: "discuss", label: "/discuss/" },
  { id: "profiles", label: "/profiles/" },
  { id: "employers", label: "/employers/" },
  { id: "wiki", label: "/wiki/" },
  { id: "posts", label: "/posts/" },
  { id: "p_short", label: "/p/" },
  { id: "page", label: "/page/" },
  { id: "at_mention", label: "/@" },
  { id: "media", label: "/media/" },
  { id: "webpage", label: "/webpage/" },
  { id: "blog", label: "/blog/" },
  { id: "idea", label: "/idea/" },
  { id: "forums", label: "/forums/" },
  { id: "guestbook", label: "/guestbook.html" },
  { id: "viewtopic", label: "/viewtopic." },
];

export const cleanData = (urls, options) => {
  // Remove empty lines and whitespace first
  let processed = urls.map(u => u.trim()).filter(u => u !== "");

  // 1. Trim Query Params (?id=123)
  if (options.trimParams) {
    processed = processed.map(url => {
      try {
        // We only trim if the URL doesn't match a category that explicitly REQUIRES query params
        // (Like your "?tab=field..." category)
        if (url.includes('?tab=field')) return url;
        return url.split('?')[0];
      } catch (e) { return url; }
    });
  }

  // 2. Remove Duplicates
  if (options.removeDuplicates) {
    processed = [...new Set(processed)];
  }

  return processed;
};

export const processUrls = (urls, categories) => {
  const results = {};

  // Initialize buckets
  categories.forEach(cat => results[cat.id] = []);
  results['other'] = [];

  if (!urls || urls.length === 0) return results;

  urls.forEach(url => {
    let lowerUrl = url.toLowerCase();
    let categorized = false;

    for (const cat of categories) {
      if (lowerUrl.includes(cat.label.toLowerCase())) {
        results[cat.id].push(url);
        categorized = true;
        break; // Stop at first match (priority based on list order)
      }
    }

    if (!categorized) {
      results['other'].push(url);
    }
  });

  return results;
};