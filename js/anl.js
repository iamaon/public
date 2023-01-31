const anl = {}

const getSrc = (src) => {
    return Array.isArray(src) ? src : (src["d"]).newWithKey(src["k"])
}

anl.ema = (src, pr, sm) => {
    src = getSrc(src)
    const ema = []
    const k = 2.0 / (pr + 1.0)
    ema[0] = src[0]
    for (let i = 1; i < src.length; i++) {
        ema[i] = ema[i - 1] + k * (src[i] - ema[i-1]) || 0.0
    }
    return ema
}

anl.emaCrossing = (src, fEma, sEma) => {
    src = getSrc(src)
    for (let i=1; i<src.length; i++) {
        if (fEma[i-1] < sEma[i-1] && fEma[i] > sEma[i]) {
            console.log(`Fast EMA crossed above Slow EMA at {${i}}`)
            //Sell
        } else if (fEma[i-1] > sEma[i-1] && fEma[i] < sEma[i]) {
            console.log(`Fast EMA crossed below Slow EMA at {${i}}`)
            //Sell
        }
    }
}

anl.rsi = (src, pr) => {
    src = getSrc(src)
    const rsi = []
    const gains = []
    const losses = []

    for (let i=1; i<src.length; i++) {
        const chg = src[i] - src[i-1]
        if (chg > 0) {
            gains[i] = chg
            losses[i] = 0
        } else {
            gains[i] = 0
            losses[i] = -chg
        }
    }

    const avgGains = anl.ema(gains, pr)
    const avgLosses = anl.ema(losses, pr)

    for (let i=pr; i<src.length; i++) {
        const rs = avgGains[i]/avgLosses[i]
        rsi[i] = 100 - (100/(1+rs)) || 0.0
    }

    return rsi
}

export { anl }
