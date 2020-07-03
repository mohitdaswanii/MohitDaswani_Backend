const express = require("express")
const fs = require("fs")
const app = express()
app.use(express.json())
app.get("/", function (req, res) {
    const { height, restitution } = req.body
    let arr = []
    let temp = 0
    let vel = 0
    let g = 10
    let start_t = 0
    let dt = 0.001
    let C_res = restitution
    let time_bounce = 0.1
    let hmax = height
    let h = height
    let hstop = 0.01
    let freefall = true
    let t_last = (-1) * (2 * height / g) ** (1 / 2)
    let vmax = (2 * hmax * g) ** 1 / 2
    let count = 0
    while (hmax > hstop) {
        if (freefall == true) {
            hnew = h + vel * dt - 0.5 * g * dt * dt
            if (hnew < 0) {
                start_t = t_last + 2 * ((2 * hmax / g) ** (1 / 2))
                freefall = false
                t_last = start_t + time_bounce
                h = 0
            }
            else {
                start_t = start_t + dt
                vel = vel - g * dt
                h = hnew
            }
        }

        else {
            start_t = start_t + time_bounce
            vmax = vmax * C_res
            vel = vmax
            freefall = true
            h = 0
            count = count + 1
        }
        hmax = (0.5 * vmax * vmax) / g
        const Hr = Math.round(h * 10) / 10
        const Tr = Math.round(start_t * 1000) / 1000
        if (Hr != temp) {
            temp = Hr
            arr.push({ Hr, Tr })
        }

    }

    obj = {Height:height, totalBounce: count, arr }
    fs.readFile("./data.json",{encoding:"utf-8"},function(err,id){
        if(err) res.status(500).send("1server error")
        var data=JSON.parse(id)
        data.push(obj)
    fs.writeFile("./data.json", JSON.stringify(data), (err)=>{
        if (err) res.status(500).send("server error")
        res.status(201).send(obj)
    })
 })
})
app.listen(5000, () => {
    console.log("server connected")
})
