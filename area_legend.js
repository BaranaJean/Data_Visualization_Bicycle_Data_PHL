   // legends
const legendG = area.selectAll("g legend")
                        .data(data)
                        .enter()
                        .append("g")
                        .attr("transform", (d, i) => {
                            let dx = LEGEND_X;
                            let dy = LEGEND_Y + (LEGEND_H + LEGEND_GAP) * i;

                            return `translate(${dx}, ${dy})`;
                         })
                        .on("mouseover", (event, d) => {
                             let i = data.indexOf(d);
                             chartG.select("#path" + i)
                                   .style("fill", colors[i]);
                         })
                        .on("mouseout",  (event, d) => {
                             let i = data.indexOf(d);
                             chartG.select("#path" + i)
                                   .style("fill", "none");
                         })
                        .style("fill", (d, i) => colors[i])
                        ;

   legendG.append("rect")
          .attr("width", LEGEND_W)
          .attr("height", LEGEND_H)
          ;

   legendG.append("text")
          .attr("x", LEGEND_W + LEGEND_GAP)
          .attr("y", LEGEND_H *0.75)
          .text((d) => d[0])
          ;