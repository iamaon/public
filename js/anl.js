const anl = {}
const rgx = {
    ohlcv: /("s":\[.*\]),"ns"/g,
    tscu: /"m":"timescale_update"/,
    its: /"INTEREST_SYM"/,
    smrs: /"m":"symbol_resolved"/,
    reset: /\~RESET\~/
}

const getSrc = (src) => {
    return Array.isArray(src) ? src : (src["d"]).newWithKey(src["k"])
}

const timeToLocal = (originalTime) => {
    const d = new Date(originalTime * 1000);
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) / 1000;
}

const timeToTz = (originalTime, timeZone) => {
    const zonedDate = new Date(new Date(originalTime * 1000).toLocaleString('en-US', { timeZone }));
    return zonedDate.getTime() / 1000;
}

anl.ema = (src, pr, sm) => {
    src = getSrc(src)
    const ema = []
    const k = 2.0 / (pr + 1.0)
    ema[0] = src[0]
    for (let i = 1; i < src.length; i++) {
        let rawEma = ema[i - 1] + k * (src[i] - ema[i - 1]) || 0.0
        ema[i] = +parseFloat(rawEma).toFixed(2)
    }
    return ema
}

anl.emaCrossing = (src, fEma, sEma) => {
    src = getSrc(src)
    let lf = 0, ls = 0;
    for (let i=1; i<src.length; i++) {
        if (fEma[i-1] < sEma[i-1] && fEma[i] > sEma[i]) {
            // console.log(`Fast EMA crossed above Slow EMA at {${i}}`)
            lf = i
            //Sell
        } else if (fEma[i-1] > sEma[i-1] && fEma[i] < sEma[i]) {
            // console.log(`Fast EMA crossed below Slow EMA at {${i}}`)
            ls = i
            //Sell
        }
    }
    return {lf: lf, ls: ls}
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
        let rawRsi = 100 - (100 / (1 + rs)) || 0.0
        rsi[i] = { v: +parseFloat(rawRsi).toFixed(2), ag: avgGains[i], al: avgLosses[i] }
    }

    return rsi
}

anl.newEma = (src, pr, pvEma) => {
    const k = 2.0 / (pr + 1.0)
    const raw = (src * k) + (pvEma * (1 - k))
    return +parseFloat(raw).toFixed(2)
}

anl.newRsi = (src, cur, oldRsi, pr) => {

    const newSrc = [...src, cur]
    const newV = newSrc.newWithKey("v")

    const n = newSrc.length
    let diff = newV[n - 1] - newV[n-2]
    let gain = (diff > 0) ? diff : 0
    let loss = (diff < 0) ? -diff : 0
    
    let avgGain = oldRsi.ag * (pr - 1) / pr + gain / pr
    let avgLoss = oldRsi.al * (pr - 1) / pr + loss / pr

    const raw = 100 - (100 / (1 + (avgGain / avgLoss)))
    return +parseFloat(raw).toFixed(2)
}

anl.pnl = (c, hzLz, r, cdt) => {
    const tp = cdt ? ((r * (hzLz.hz - hzLz.lz)) + hzLz.hz) : c.low - ((hzLz.hz -c.low) * r)
    const sl = cdt ? hzLz.lz : hzLz.hz
    return { tp: +parseFloat(tp).toFixed(2), sl: +parseFloat(sl).toFixed(2) }
}

anl.maxZ = (arr, k) =>{
    return arr.map(i => i[k]).reduce((max, obj) => Math.max(max, obj), 0);
}

anl.minZ = (arr, k) => {
    return arr.map(i => i[k]).reduce((min, obj) => Math.min(min, obj), Infinity);
}

anl.hzLz = (hzArr, lzArr) => {
    const maxHz = anl.maxZ(hzArr, "high")
    const minLz = anl.minZ(lzArr, "low")
    return { hz: maxHz, lz: minLz }
}

anl.tpRat = 2

anl.lookBack = {
    hz: 20,
    lz: 20
}


const tv = {}

tv.dcp = {
    width: 700,
    height: 400,
    timeScale: {
        timeVisible: true,
        secondsVisible: false
    },
    layout: {
        backgroundColor: '#131722',
        textColor: '#d1d4dc',
    },
    rightPriceScale: {
        scaleMargins: {
            top: 0.1,
            bottom: 0.25,
        },
        borderVisible: false,
    },
    grid: {
        vertLines: {
            color: 'rgba(42, 46, 57, 0)',
        },
        horzLines: {
            color: 'rgba(42, 46, 57, 0.6)',
        },
    },
}

tv.cop = {
    topColor: 'rgba(38,198,218, 0.56)',
    bottomColor: 'rgba(38,198,218, 0.04)',
    lineColor: 'rgba(38,198,218, 1)',
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
    }
}

tv.vcp = {
    priceFormat: {
        type: 'volume',
    },
    priceScaleId: 'VOL',
    scaleMargins: {
        top: 0.7,
        bottom: 0,
    }
}

tv.rcp = {
    color: 'rgba(116, 85, 128, 0.7)', 
    lineWidth: 3,
    priceScaleId: 'RSI',
    scaleMargins: {
        top: 0.4,
        bottom: 0.4,
    }
}

tv.getRtp = (arr, k) => {
    const tmp = arr.newWithKey(k)
    return tv.tvMap(tmp[0])
}

tv.tvMap = (arr) => {
    const keys = ["time", "open", "high", "low", "close", "volume"]
    arr[0] = timeToLocal(arr[0])
    arr[5] = +parseFloat(arr[5]).toFixed(2)
    return Object.assign({}, ...arr.map((val, i) => ({ [keys[i]]: val })));
}

tv.cl = {
    voc: 'rgba(200, 120, 120, 0.8)',
    vco: 'rgba(20, 150, 200, 0.8)',
    blc: 'rgba(151, 219, 180, 0.8)',
    brc: 'rgba(219, 185, 151, 0.8)',
    osc: 'rgba(255, 50, 50, 1.0)',
    obc: 'rgba(50, 255, 50, 1.0)'
}

const cm = {}

cm.unShift = (p, e) => {
    p.insertBefore(e, p.firstChild)
}

export { anl, rgx, tv, cm }
