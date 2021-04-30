const uniqueLogEntries = [];

function windowVar(variableName) {
  return typeof window !== "undefined" && window[variableName] || undefined;
}

function getUniqueLogEntries() {
  const entries = windowVar("uniqueLogEntries") || uniqueLogEntries;
  return entries;
}

function addToUniqueLogEntries(entry) {
  (windowVar("uniqueLogEntries") || uniqueLogEntries)
    .push(entry);
}

export function wvusLogger(...args){
  const logger = windowVar("wvus") &&
    typeof window.wvus.logger === 'function' &&
    window.wvus.logger || (() => {
      // empty function do nothing
    });

  return logger.apply(null, args);
}

export function getCookieVal(name, decodeVal = true) {
  if (!windowVar("document") || !window.document.cookie) {
    return '';
  }

  const reCookieName = new RegExp(`${name}=([^;]+)`).exec(window.document.cookie);
  const cookieVal = reCookieName && reCookieName[1] || '';

  if (decodeVal === true) {
    return decodeURIComponent(cookieVal);
  }

  return cookieVal;
}

export function getPartAuth(){
  try {
    const partAuthStr = getCookieVal('SESSpartauth');
    const partAuthVal = partAuthStr && JSON.parse(partAuthStr) || partAuthStr;

    if (partAuthVal && (typeof window !== "undefined")) {
      // Store This To A window variable
      window.appPartauthVal = partAuthVal;
    }

    return partAuthVal || windowVar("appPartauthVal") || "";
  } catch (err) {
    return "";
  }
}

export function parseMessage(details) {
  const isError = details instanceof Error;

  return {
    description: isError && details.message || details,
    isError: isError
  };
}

export function logAppInfo(details = null) {
  // If There is Part Auth Data To Log, Then Log It
  if (getPartAuth()) {
    return appLogger(details, 'info');
  }
}

export function userAccessLogger(details) {
  const { isError, description } = parseMessage(details);

  if (!isError && typeof description === "object") {
    // Only Parse Out Specific Context That May Not Get Passed To The Promise
    const logEntry = Object.assign({}, details, {
      "source": "wvus-client-auth-token-manager.js"
    });

    appLoggerOnce(logEntry, 'error');
  }
}

export function isSameLogEntry(entry1, entry2) {
  try {
    return JSON.stringify(entry1) === JSON.stringify(entry2);
  } catch (e) {
    // Silently Fail, but return false
    return false;
  }
}

export function addLogContext(details = null, level = "notice", addAsUnique = false) {
  const partAuth = getPartAuth();
  const userAgent = windowVar("navigator") && window.navigator.userAgent || '';
  const usersDate = new Date();
  const dateString = usersDate.toString();
  const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { description, isError } = parseMessage(details);
  const logDetails = {
    "SESSpartauth": partAuth,
    "userAgent": userAgent,
    "UserTimeZone": clientTimeZone,
    "UsersDate": dateString
  };

  const logMessage = typeof description === 'object' ?
    Object.assign({}, logDetails, description) :
    Object.assign({}, logDetails, {description});

  const logLevel = isError && 'error' || level;

  return {logMessage, logLevel};
}

export function appLoggerOnce(details = null, level = "notice") {
  try {
    const logEntries = getUniqueLogEntries();
    const { logMessage, logLevel } = addLogContext(details, level);

    // Search For Existing Entries
    const isNotUnique = logEntries
      .some((log) => {
        const sameLevel = log.level === logLevel;
        return isSameLogEntry(log.message, logMessage) && sameLevel;
      });

    // Will Not Add Duplicate Log
    if (isNotUnique) {
      return false;
    }

    // Log With Details
    wvusLogger(logMessage, logLevel);

    // Include In Array Of Unique Log Entries
    addToUniqueLogEntries({
      message: logMessage,
      level: logLevel
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export default function appLogger(details = null, level = "notice") {
  try {
    const { logMessage, logLevel } = addLogContext(details, level);

    // Log With Details
    wvusLogger(logMessage, logLevel);
  } catch (err) {
    console.log(err);
  }
}
