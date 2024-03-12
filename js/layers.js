addLayer("AM", {
    name: "Antimatter", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "AnMa", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#DDDDDD",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Antimatter", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: new Decimal(1), // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(buyableEffect("AM", "DIMENSION-1"))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    buyables: {
        "DIMENSION-1": {
            cost(x) {
                let power_1 = new Decimal(10)
                let y = new Decimal.div(x, 10).floor()
                let cost = new Decimal(10).mul(Decimal.pow(y.add(1) , power_1))
                return cost
            },
            canAfford() {
                return player.AM.points.gte(this.cost())
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
            effect(x) {
                let power_1 = new Decimal(1.125)
                let eff = new Decimal(1).mul(Decimal.pow(power_1, x))
                return eff
            },
            display() {
                return `<span style="font-size: 18px; left: 4px; top: 4px; position: absolute">DIMENSION I</span>
                <span style="font-size: 14px; left: 4px; top: 24px; position: absolute">Generates ${format(this.effect())} AM / s</span>
                <span style="font-size: 14px; left: 4px; bottom: 4px; position: absolute">${format(this.cost())} Antimatter</span>
                <span style="font-size: 14px; right: 4px; top: 4px; position: absolute">${format(player[this.layer].buyables[this.id], 0)}</span>`
            },
            style() {
                return {
                    'height': '64px !important',
                    'width': '320px',
                    'border-radius': '0px'
                }
            }
        }
    },
    tabFormat: {
        "Dimensions": {
            content: [
                ['raw-html', () => {return `You have <span style="font-size: 22px; text-shadow: 0px 0px 8px #DDDDDD">${format(player.AM.points)}</span> Antimatter<br> ( + ${format(tmp.AM.resetGain)} /s )`}],
                "blank",
                ["row", [["buyable", "DIMENSION-1"]]]
            ]
        }
    }
})
