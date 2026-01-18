export function normalizeText(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// simple levenshtein (pour fuzzy minimal)
function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => i);
  for (let j = 1; j <= n; j++) {
    let prev = dp[0];
    dp[0] = j;
    for (let i = 1; i <= m; i++) {
      const cur = dp[i];
      const add = prev + (a[i - 1] === b[j - 1] ? 0 : 1);
      const del = dp[i - 1] + 1;
      const sub = dp[i] + 1;
      prev = dp[i];
      dp[i] = Math.min(add, del, sub);
    }
  }
  return dp[m];
}

export  function isAccountIntent(raw, patterns = []) {
  const s = normalizeText(raw);
  if (!s) return false;

  // test par inclusion stricte (accent-insensitive)
  for (const p of patterns) {
    if (s.includes(p)) return true;
    // mot boundary regex (évite faux positifs)
    const re = new RegExp('\\b' + p.replace(/\s+/g, '\\s+') + '\\b', 'i');
    if (re.test(s)) return true;
  }

  // fuzzy : vérifier si un token proche d'un motif (utile pour fautes de frappe)
  const tokens = s.split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    for (const p of ['inscription','compte','connexion','mdp','mot de passe','sinscrire','creer']) {
      const dist = levenshtein(token, p.split(' ')[0]);
      if (dist <= 1 && token.length >= 3) return true;
    }
  }

  return false;
}
