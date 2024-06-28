const formatETH = (ethValue) => {
    const ethString = ethValue.toString();
    const decimalIndex = ethString.indexOf('.');

    if (decimalIndex === -1) {
        return ethString;
    }

    const firstNonZeroDigitIndex = ethString.substring(decimalIndex + 1).search(/[1-9]/);

    if (firstNonZeroDigitIndex === -1) {
        return ethString.substring(0, decimalIndex);
    }

    const formattedEth = ethString.substring(0, decimalIndex + firstNonZeroDigitIndex + 3);

    return formattedEth;
}

export default formatETH
