export const shortenEthAddy = (addy) => {
    const shorty = addy.slice(0,4) + "..." + addy.slice(addy.length - 4,addy.length)
    return shorty
}