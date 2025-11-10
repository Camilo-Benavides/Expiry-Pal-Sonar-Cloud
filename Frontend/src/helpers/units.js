// Simple unit conversion & formatting helpers for recipes

export function fmt(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '';
  // show integers without decimals, otherwise 2 decimal places
  if (Number.isInteger(n)) return String(n);
  const num = Number(n);
  const abs = Math.abs(num);
  // For very small values show extra precision so they don't round to 0
  if (abs > 0 && abs < 0.01) {
    // show up to 4 decimal places, trim trailing zeros
    return num.toFixed(4).replace(/(?:\.0+|(?<=\.[0-9]*?)0+)$/, '').replace(/\.$/, '');
  }
  // default: 2 decimal places, trim trailing .00
  return num.toFixed(2).replace(/(?:\.00|(?<=\.[0-9]*?)0+)$/, '').replace(/\.$/, '');
}

// Convert an amount from one unit system to another (heuristic)
// amount: number, unit: string (from recipe), target: 'metric'|'imperial'
// Returns an object { amount: number, unit: string } or null if no conversion
export function convertAmount(amount, unit, target) {
  if (!amount && amount !== 0) return null;
  if (!unit || !target) return null;
  const u = String(unit).toLowerCase();
  const t = target === 'imperial' ? 'imperial' : 'metric';

  // grams <-> oz
  if (u === 'g' || u === 'gram' || u === 'grams') {
    if (t === 'imperial') return { amount: amount * 0.035274, unit: 'oz' };
    return null;
  }
  if (u === 'oz' || u === 'ounce' || u === 'ounces') {
    if (t === 'metric') return { amount: amount * 28.3495, unit: 'g' };
    return null;
  }

  // kilograms <-> lb
  if (u === 'kg' || u === 'kilogram' || u === 'kilograms') {
    if (t === 'imperial') return { amount: amount * 2.20462, unit: 'lb' };
    return null;
  }
  if (u === 'lb' || u === 'pound' || u === 'pounds') {
    if (t === 'metric') return { amount: amount * 0.453592, unit: 'kg' };
    return null;
  }

  // milliliters / liters <-> cups (approx)
  if (u === 'ml' || u === 'milliliter' || u === 'milliliters') {
    if (t === 'imperial') return { amount: amount * 0.00422675, unit: 'cups' };
    return null;
  }
  if (u === 'l' || u === 'liter' || u === 'liters') {
    if (t === 'imperial') return { amount: amount * 4.22675, unit: 'cups' };
    return null;
  }
  if (u === 'cup' || u === 'cups') {
    if (t === 'metric') return { amount: amount * 236.588, unit: 'ml' };
    return null;
  }

  // teaspoon / tablespoon conversions (metric <-> tsp/tbsp)
  if (u === 'tsp' || u === 'teaspoon' || u === 'teaspoons') {
    if (t === 'metric') return { amount: amount * 4.92892, unit: 'ml' };
    return null;
  }
  if (u === 'tbsp' || u === 'tablespoon' || u === 'tablespoons') {
    if (t === 'metric') return { amount: amount * 14.7868, unit: 'ml' };
    return null;
  }

  return null;
}

// parse simple quantities like "1 1/2", "1/2", "2.5" into number
export function parseQuantity(s) {
  if (!s) return null
  let str = String(s).trim()
  str = str.replace(/-/g, ' ')
  const mixed = /^([0-9]+)\s+([0-9]+)\/([0-9]+)$/.exec(str)
  if (mixed) return Number(mixed[1]) + (Number(mixed[2]) / Number(mixed[3]))
  const frac = /^([0-9]+)\/([0-9]+)$/.exec(str)
  if (frac) return Number(frac[1]) / Number(frac[2])
  const num = Number(str.replace(/,/g, '.'))
  return Number.isFinite(num) ? num : null
}

// temperature conversion helper: value numeric string -> converted number
export function convertTemp(value, to) {
  const n = Number(String(value).replace(',', '.'))
  if (!Number.isFinite(n)) return null
  if (to === 'imperial') return Math.round((n * 9/5) + 32)
  return Math.round((n - 32) * 5/9)
}

// convert mg to oz (small numbers) or back
export function convertMgToOz(mg) {
  if (mg == null) return null
  const n = Number(mg)
  if (!Number.isFinite(n)) return null
  return n * 0.000035274
}

export default {
  fmt,
  convertAmount,
};
