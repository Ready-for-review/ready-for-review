import { format, parseISO } from "date-fns";
import string from "string";

export function slug(input) {
  if (!input) {
    return false;
  }
  return string(input).slugify().toString();
}

export function shortReadableDateFromISO(dateStr) {
  return format(parseISO(dateStr), "dd.MM.yyyy");
}

export function shortReadableDate(dateStr) {
  return format(dateStr, "dd.MM.yyyy");
}

export function toEpisodeUrl(episode) {
  return `${format(parseISO(episode.isoDate), "yyyy/MM/dd")}/${slug(
    episode.title,
  )}`;
}
