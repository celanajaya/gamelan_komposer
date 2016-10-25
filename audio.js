function getSamples(instrument, range)  {
    var arr = [];
    //TODO: get ugal and penyacah samples for ugal
    instrument = instrument === "ugal" ? "pemade":instrument;
    instrument = instrument === "penyacah" ? "jublag":instrument;

    for (var i = 0; i < range; i++) {
        var filename = instrument + "_" + i.toString() + ".mp3";
        var filePath = "./audio/" + instrument + "/mp3/" + filename;
        arr.push(filePath);
    }
    return arr;
}

function loadGongs() {
   return ["./audio/gongs/mp3/gong.mp3","./audio/gongs/mp3/kemong.mp3"]
}

function setLoop(instrument) {
    return function () {
        var i = 0;
        var q = [];
        var interval;
        var offset = 0;

        switch (instrument) {
            case "jegogan":
                interval = "1n";
                offset = "1:0:0";
                break;
            case "jublag":
                interval = "2n";
                offset = "0:1:4";
                break;
            case "penyacah":
            case "ugal":
                interval = "4n";
                offset = "0:0:4";
                break;
            case "pemade":
            case "kantilan":
                interval = "16n";
                offset = "0:0:4";
                break;
            case "reyong":
                interval = "16n";
                offset = "0:1:1";
                break;
        }

        new Tone.Loop(function (time) {

            q.forEach(toggleActive);
            q = [];
            var buffers = getBuffers(instrument, i);
            buffers.forEach(function(buffer){
                if (buffer === "-" || players[instrument].mute) return;
                players[instrument].start(buffer);
                players[instrument].stop(buffer, "+" + interval);
                q.push(document.getElementById(instrument + " " + buffer));
            });
            q.forEach(toggleActive);
            i++;
        }, interval).start(offset);
    }
}

//TODO: find ways to appropriately cross octaves
//this method converts
function getBuffers(instrument, index) {
    //helper function for parsing gangsa buffers
    function bufferFromPart(buffers, part) {
        var value = part[index % part.length];
        if (value != "-") {
            var gangsaBuffer = gangsaRange.indexOf(value);
            //if it's below low dang, move to upper octave
            gangsaBuffer = gangsaBuffer < 3 ? gangsaBuffer + 5 : gangsaBuffer
            buffers.push(gangsaBuffer);
        } else {
            buffers.push(value);
        }
        return buffers;
    }

    switch (instrument) {
        case "jegogan":
            return [jegogan[index % jegogan.length] - 1];
        case "jublag":
            return [pokok[index % pokok.length] - 1];
        case "penyacah":
            return [neliti[index % neliti.length] - 1];
        case "ugal":
            var lowOctaveBuffer = gangsaRange.indexOf(neliti[index % neliti.length]);
            return [lowOctaveBuffer + 5];
        case "pemade":
            return pemade_part.reduce(bufferFromPart, []);
        case "kantilan":
            return kantilan_part.reduce(bufferFromPart, []);
        case "reyong":
            return reyong_part.map(function(arr){return arr[index % (pokok.length * 8)]});
    }
}

function configureGong() {
    players["gong"] = new Tone.MultiPlayer(loadGongs(), function () {
        var i = 0;
        new Tone.Loop(function (time) {
            if (i === 0) {
                i++;
                return;
            }
            if (i % pokok.length === pokok.length / 2 - 1) {
                players["gong"].start(1);
            }
            if (i % pokok.length === pokok.length - 1) {
                players["gong"].start(0);
            }
            i++;
        }, "2n").start("0:1:4");
    }).toMaster();
    players["gong"].fadeIn = 0.1;
    players["gong"].fadeOut = 0.3;
}

//handle animations
function toggleActive(item) {
    if (!item) return;
    if (item.classList.contains("active")){
        item.classList.remove("active")
    } else {
        item.classList.add("active");
    }
}

