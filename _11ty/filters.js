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

export function regex_test(str, pattern) {
  const regex = new RegExp(pattern);
  return regex.test(str);
}

export function date(input, formatStr) {
  if (input === "now") {
    return format(new Date(), formatStr);
  }
  if (typeof input === "string") {
    return format(parseISO(input), formatStr);
  }
  return format(input, formatStr);
}

export function isActiveNavItem(entryUrl, currentUrl) {
  if (entryUrl === currentUrl) {
    return true;
  }

  // Entferne trailing slashes für Vergleich
  const cleanEntryUrl = entryUrl.replace(/\/$/, "") || "/";
  const cleanCurrentUrl = currentUrl.replace(/\/$/, "") || "/";

  // Wenn entry die Homepage ist, nur exakte Übereinstimmung
  if (cleanEntryUrl === "/") {
    return cleanCurrentUrl === "/";
  }

  // Prüfe ob current URL ein "Kind" der entry URL ist
  return (
    cleanCurrentUrl.startsWith(cleanEntryUrl + "/") ||
    cleanCurrentUrl === cleanEntryUrl
  );
}
export function isInNavSection(navEntry, currentUrl, allNavigation) {
  // Direkter Match
  if (navEntry.url === currentUrl) {
    return true;
  }

  // Rekursive Funktion um alle Kinder zu durchsuchen
  function hasActiveChild(entry) {
    if (entry.children) {
      return entry.children.some((child) => {
        return child.url === currentUrl || hasActiveChild(child);
      });
    }
    return false;
  }

  return hasActiveChild(navEntry);
}
