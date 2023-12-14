import { BlogDocument } from "../../models/blog";
import { EstateDocument } from "../../models/estate";

export const updateBlogViews = (blog: BlogDocument) => {
  // update seen
  blog.lead.seen = (blog.lead.seen || 0) + 1;

  // update see for current date
  const today = new Date().toISOString().split("T")[0];
  const seeEntry = blog.lead.see;

  if (seeEntry) {
    // if date is different, update it
    if (seeEntry.date !== today) {
      seeEntry.date = today;
      seeEntry.count = 1;
    } else {
      seeEntry.count++;
    }
  } else {
    // if no entry exists, create a new one
    blog.lead.see = { date: today, count: 1 };
  }
};

export const updateEstateViews = (estate: EstateDocument) => {
  // update seen
  estate.head.seen = (estate.head.seen || 0) + 1;

  // update see for current date
  const today = new Date().toISOString().split("T")[0];
  const seeEntry = estate.head.see;

  if (seeEntry) {
    // if date is different, update it
    if (seeEntry.date !== today) {
      seeEntry.date = today;
      seeEntry.count = 1;
    } else {
      seeEntry.count++;
    }
  } else {
    // if no entry exists, create a new one
    estate.head.see = { date: today, count: 1 };
  }
};
