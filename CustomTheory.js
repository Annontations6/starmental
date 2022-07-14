import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "starmental";
var name = "Startmental";
var description = "=== CHANGELOG === \nv1.0.0:\nRelease!";
var authors = "Annontations6";
var version = 1;

var currency;

var g1 = BigNumber.ZERO
var g2 = BigNumber.ZERO

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // g1
    {
        let getDesc = (level) => "g_1=" + g1.toString(0);
        g1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(2))));
        g1.getDescription = (_) => Utils.getMath(getDesc(g1.level));
        g1.getInfo = (amount) => Utils.getMathTo(getDesc(g1.level), getDesc(g1.level + amount));
        g1.boughtOrRefunded = (_) => {
            g1 += BigNumber.ONE
        }
    }

    // g2
    {
        let getDesc = (level) => "g_2=" + g2.toString(0);
        g2 = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(2))));
        g2.getDescription = (_) => Utils.getMath(getDesc(g2.level));
        g2.getInfo = (amount) => Utils.getMathTo(getDesc(g2.level), getDesc(g2.level + amount));
        g2.boughtOrRefunded = (_) => {
            g2 += BigNumber.ONE
        }
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25, 25));
    
    /////////////////
    //// Achievements

    ///////////////////
    //// Story chapters

    updateAvailability();
}

var updateAvailability = () => {
    
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency.value += dt * bonus * g1
    g1 += g2
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = g_1";

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";
var getPublicationMultiplier = (tau) => tau.pow(Math.SQRT2 - 1);
var getPublicationMultiplierFormula = (symbol) => symbol + "^{\\sqrt{2}-1}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

init();
