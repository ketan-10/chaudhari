// d3 tree related configuration
const root = d3.hierarchy(data);
const svg = d3.create("svg").attr("width", 500).attr("height", 500);

const circles = svg.append("g");
const links = svg.append("g");

d3.tree().size([500, 500])(root); // inplace update hierrchy and add x and y to each.
console.log("root::: ", root);

const render = () => {
  const circlesData = root.descendants();
  console.log("circlesData::: ", circlesData);

  const linksData = root.links();
  console.log("linksData::: ", linksData);

  circles
    .selectAll("g")
    .data(circlesData, (d) => d.data.id)
    .join(
      (enter) => {
        const e = enter
          .append("g")
          .attr("cursor", "pointer")
          .on("click", (event, d) => {
            if (d.children) {
              d._children = d.children;
            }
            d.children = d.children ? null : d._children;
            render();
          });

        e.append("circle")
          .attr("r", 8)
          .attr("opacity", 0.7)
          .attr("cx", (d) => d.y)
          .attr("cy", (d) => d.x);

        e.append("text")
          .attr("x", (d) => d.y)
          .attr("y", (d) => d.x)
          .text((d) => d.data.marathi_name);
      },
      () => {},
      (exit) => {
        exit.remove();
      }
    );

  links
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("pointer-event", "none")
    .selectAll("path")
    .data(linksData, (d) => d.target.data.id)
    .join(
      (enter) => {
        enter
          .append("path")
          .attr("d", (d) => {
            const lineFunction = d3
              .linkHorizontal()
              .x((d) => d.y)
              .y((d) => d.x);
            return lineFunction(d);
          })
          .attr("stroke-opacity", 0.4)
          .attr("stroke-width", 1.5);
      },
      () => {},
      (exit) => exit.remove()
    );
};

render();

container.append(svg.node());
