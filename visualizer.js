/**
 * Created by Pete on 9/25/16.
 */

var ids = [];
function createSvg(parent, height, width) {
    var barPadding = 1;
    var frequencyData = new Uint8Array(16);
    var svg = d3.select(parent).append('svg').attr('height', height).attr('width', width);
    svg.frequencyData = frequencyData;
    //render initial state for svg
    svg.selectAll('rect')
        .data(frequencyData)
        .enter()
        .append('rect')
        .attr('width', width / frequencyData.length - barPadding)
        .attr('x', function (d, i) {
            return i * (width / frequencyData.length);
        });
    return svg;
}

//render audio components
function startAnalyzers() {
    // Copy frequency data to frequencyData array.
    for (var analyzer in analyzers) {
        if (analyzers.hasOwnProperty(analyzer)) {
            var svg = analyzers[analyzer].svg;

            svg.frequencyData = analyzers[analyzer].analyse();
            // Update d3 chart with new data.
            svg.selectAll('rect')
                .data(svg.frequencyData)
                .attr('y', function (d) {
                    return kInstrumentHeight - d*0.8;
                })
                .attr('height', function (d) {
                    if (d*0.8 < 50) return 0;
                    return d;
                })
                .attr('fill', function (d) {
                    return 'rgb(' + d + ', ' + d + ', ' + d * 2 + ')';
                });
        }
    }
    ids.push(requestAnimationFrame(startAnalyzers));
}

function stopAnalyzers() {
    console.log(ids)
    ids.forEach(function(id){
        cancelAnimationFrame(id);
    });
}