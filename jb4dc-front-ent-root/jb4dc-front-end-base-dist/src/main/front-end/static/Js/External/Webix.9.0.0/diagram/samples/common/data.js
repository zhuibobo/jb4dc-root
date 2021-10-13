/*for auto placement, x and y coordinates do not matter*/
const base_data = [
	{ id: "n1", value: "Box n1", x: 800, y: 320 },
	{ id: "n2", value: "Box n2", x: 800, y: 500 },
	{ id: "n3", value: "Box n3", x: 1000, y: 500 },
	{ id: "n4", value: "Box n4", x: 800, y: 600 },
	{ id: "n5", value: "Box n5", x: 650, y: 800 },
	{ id: "n5x1", value: "Box n5x1", x: 400, y: 700 },
	{ id: "n5x2", value: "Box n5x2", x: 300, y: 770 },
	{ id: "n5x3", value: "Box n5x3", x: 180, y: 840 },
	{ id: "n5x4", value: "Box n5x4", x: 80, y: 900 },
	{ id: "n5x5", value: "Box n5x5", x: 0, y: 750 },
	{ id: "n5x6", value: "Box n5x6", x: 50, y: 600 },
	{ id: "n5x7", value: "Box n5x7", x: 120, y: 500 },
	{ id: "n5x8", value: "Box n5x8", x: 220, y: 680 },
	{ id: "n5x9", value: "Box n5x9", x: 400, y: 600 },
	{ id: "n6", value: "Box n6", x: 350, y: 500 },
	{ id: "n7", value: "Box n7", x: 150, y: 400 },
	{ id: "n8", value: "Box n8", x: 550, y: 350 },
	{ id: "n8x1", value: "Box n8x1", x: 600, y: 580 },
	{ id: "n8x2", value: "Box n8x2", x: 0, y: 0 },
	{ id: "n8x3", value: "Box n8x3", x: 100, y: 70 },
	{ id: "n8x4", value: "Box n8x4", x: 300, y: 70 },
	{ id: "n8x5", value: "Box n8x5", x: 900, y: 0 },
	{ id: "n8x6", value: "Box n8x6", x: 700, y: 200 },
	{ id: "n7x1", value: "Box n7x1", x: 50, y: 150 },
	{ id: "n7x2", value: "Box n7x2", x: 300, y: 300 },
	{ id: "n7x3", value: "Box n7x3", x: 400, y: 150 },
	{ id: "n7x4", value: "Box n7x4", x: 550, y: 220 },
];

const base_links = [
	{ source: "n1", target: "n2" },
	{ source: "n1", target: "n3" },
	{ source: "n1", target: "n4" },
	{ source: "n2", target: "n3" },
	{ source: "n3", target: "n4" },
	{ source: "n4", target: "n2" },
	{ source: "n4", target: "n5" },
	{ source: "n5x1", target: "n5" },
	{ source: "n5x1", target: "n5x2" },
	{ source: "n5x2", target: "n5x3" },
	{ source: "n5x2", target: "n5x8" },
	{ source: "n5x3", target: "n5x4" },
	{ source: "n5x4", target: "n5x5" },
	{ source: "n5x5", target: "n5x6" },
	{ source: "n5x6", target: "n5x7" },
	{ source: "n5x7", target: "n5x8" },
	{ source: "n5x8", target: "n5x9" },
	{ source: "n6", target: "n5x9" },
	{ source: "n6", target: "n7" },
	{ source: "n6", target: "n8" },
	{ source: "n7", target: "n8" },
	{ source: "n8x1", target: "n8" },
	{ source: "n8x1", target: "n1" },
	{ source: "n8x2", target: "n8x3" },
	{ source: "n8x3", target: "n8x4" },
	{ source: "n8x4", target: "n8x5" },
	{ source: "n8x5", target: "n8x6" },
	{ source: "n7", target: "n7x1" },
	{ source: "n7", target: "n7x2" },
	{ source: "n7x2", target: "n7x3" },
	{ source: "n7x2", target: "n7x4" },
	{ source: "n1", target: "n8x6" },
];

const tree_data = [
	{ id: "root", value: "Board of Directors" },
	{ id: "1", value: "Managing Director" },
	{ id: "1.1", value: "Base Manager" },
	{ id: "1.1.1", value: "Store Manager" },
	{ id: "1.1.2", value: "Office Assistant" },
	{ id: "1.1.2.1", value: "Dispatcher" },
	{ id: "1.1.2.1.1", value: "Drivers" },
	{ id: "1.1.3", value: "Security" },
	{ id: "1.2", value: "Business Development Manager", height: 70 },
	{ id: "1.2.1", value: "Marketing Executive" },
	{ id: "1.3", value: "Finance Manager" },
	{ id: "1.3.1", value: "Accountant" },
	{ id: "1.3.1.1", value: "Accounts Officer" },
	{ id: "1.4", value: "Project Manager" },
	{ id: "1.4.1", value: "Supervisors" },
	{ id: "1.4.1.1", value: "Foremen" },
];

const tree_links = [
	{ source: "root", target: "1" },
	{ source: "1", target: "1.1" },
	{ source: "1.1", target: "1.1.1" },
	{ source: "1.1", target: "1.1.2" },
	{ source: "1.1.2", target: "1.1.2.1" },
	{ source: "1.1.2.1", target: "1.1.2.1.1" },
	{ source: "1.1", target: "1.1.3" },
	{ source: "1", target: "1.2" },
	{ source: "1.2", target: "1.2.1" },
	{ source: "1", target: "1.3" },
	{ source: "1.3", target: "1.3.1" },
	{ source: "1.3.1", target: "1.3.1.1" },
	{ source: "1", target: "1.4" },
	{ source: "1.4", target: "1.4.1" },
	{ source: "1.4.1", target: "1.4.1.1" },
];

const complex_tree_data = [
	{ id: "1", value: "Center Director", height: 40 },
	{ id: "1.1", value: "Research &amp; Development" },
	{ id: "1.1.1", value: "Research", height: 40 },
	{ id: "1.1.1.1", value: "Base research" },
	{ id: "1.1.1.2", value: "Collaborative research" },
	{ id: "1.1.2", value: "Development", height: 40 },
	{ id: "1.1.2.1", value: "Faculty development workshops", height: 70 },
	{ id: "1.1.2.2", value: "Student development" },
	{ id: "1.2", value: "Teaching &amp Training" },
	{ id: "1.2.1", value: "Teaching", height: 40 },
	{ id: "1.2.1.1", value: "Course development" },
	{ id: "1.2.1.2", value: "Teaching" },
	{ id: "1.2.2", value: "Training", height: 40 },
	{ id: "1.2.2.1", value: "Conduct workshops" },
	{ id: "1.2.2.2", value: "Conduct seminars" },
];

const complex_tree_links = [
	{ source: "1", target: "1.1" },
	{ source: "1.1", target: "1.1.1" },
	{ source: "1.1", target: "1.1.2" },
	{ source: "1.1.1", target: "1.1.1.1", mode: "child" },
	{ source: "1.1.1.1", target: "1.1.1.2", mode: "sibling" },
	{ source: "1.1.2", target: "1.1.2.1", mode: "child" },
	{ source: "1.1.2.1", target: "1.1.2.2", mode: "sibling" },
	{ source: "1", target: "1.2" },
	{ source: "1.2", target: "1.2.1" },
	{ source: "1.2", target: "1.2.2" },
	{ source: "1.2.1", target: "1.2.1.1", mode: "child" },
	{ source: "1.2.1.1", target: "1.2.1.2", mode: "sibling" },
	{ source: "1.2.2", target: "1.2.2.1", mode: "child" },
	{ source: "1.2.2.1", target: "1.2.2.2", mode: "sibling" },
];

const stylized_tree_links = [
	{ source: "1", target: "1.1", arrow: "triangle" },
	{
		source: "1.1",
		target: "1.1.1",
		arrow: "triangle",
		backgroundColor: "#CCD7E6",
	},
	{
		source: "1.1",
		target: "1.1.2",
		arrow: "triangle",
		backgroundColor: "#CCD7E6",
	},
	{
		source: "1.1.1",
		target: "1.1.1.1",
		mode: "child",
		arrow: false,
		$css: "red_line",
	},
	{
		source: "1.1.1.1",
		target: "1.1.1.2",
		mode: "sibling",
		arrow: false,
		$css: "red_line",
	},
	{
		source: "1.1.2",
		target: "1.1.2.1",
		mode: "child",
		arrow: false,
		$css: "blue_line",
	},
	{
		source: "1.1.2.1",
		target: "1.1.2.2",
		mode: "sibling",
		arrow: false,
		$css: "blue_line",
	},
	{ source: "1", target: "1.2", arrow: "triangle" },
	{ source: "1.2", target: "1.2.1" },
	{ source: "1.2", target: "1.2.2" },
	{
		source: "1.2.1",
		target: "1.2.1.1",
		mode: "child",
		arrow: false,
		lineColor: "#61b578",
		lineWidth: 2,
	},
	{
		source: "1.2.1.1",
		target: "1.2.1.2",
		mode: "sibling",
		arrow: false,
		lineColor: "#61b578",
		lineWidth: 2,
	},
	{
		source: "1.2.2",
		target: "1.2.2.1",
		mode: "child",
		arrow: false,
		lineStyle: "dashed",
	},
	{
		source: "1.2.2.1",
		target: "1.2.2.2",
		mode: "sibling",
		arrow: false,
		lineStyle: "dashed",
	},
];

const base_shapes = [
	{ id: "n1", x: 0, y: 0, type: "rrect", value: "rounded rectangle" },
	{ id: "n2", x: 0, y: 80, type: "preparation" },
	{ id: "n3", x: 0, y: 160, type: "circle" },
	{ id: "n4", x: 0, y: 240, type: "decision" },
	{ id: "n5", x: 0, y: 320, type: "data" },
	{ id: "n6", x: 0, y: 400, type: "document" },
	{ id: "n7", x: 0, y: 480, type: "tail" },
	{ id: "n8", x: 0, y: 560, type: "delay" },
	{ id: "n9", x: 0, y: 640, type: "head" },
	{ id: "n10", x: 0, y: 720, type: "sort" },

	{ id: "n11", x: 150, y: 0, type: "output" },
	{ id: "n12", x: 150, y: 80, type: "input" },
	{ id: "n13", x: 150, y: 160, type: "merge" },
	{ id: "n14", x: 150, y: 240, type: "subroutine" },
	{ id: "n15", x: 150, y: 320, type: "process" },
	{ id: "n16", x: 150, y: 400, type: "start", value: "start / end" },
	{ id: "n17", x: 150, y: 480, type: "triangle" },
	{ id: "n18", x: 150, y: 560, type: "storage" },
	{ id: "n19", x: 150, y: 640, type: "dot" },
	{ id: "n20", x: 150, y: 720, type: "collate" },

	{ id: "n21", x: 300, y: 0, type: "connector" },
	{ id: "n22", x: 300, y: 80, type: "database" },
	{ id: "n23", x: 300, y: 160, type: "display" },
	{ id: "n24", x: 300, y: 240, type: "ellipse" },
	{ id: "n25", x: 300, y: 320, type: "internal" },
	{ id: "n26", x: 300, y: 400, type: "junction" },
	{ id: "n27", x: 300, y: 480, type: "looplimit" },
	{ id: "n28", x: 300, y: 560, type: "sdata" },
	{ id: "n29", x: 300, y: 640, type: "tape" },
	{ id: "n30", x: 300, y: 720, type: "operation" },

	{ id: "n41", x: 450, y: 0, type: "or" },
	{ id: "n42", x: 450, y: 80, type: "output" },
	{ id: "n43", x: 450, y: 160, type: "pentagon" },
	{ id: "n44", x: 450, y: 240, type: "plus" },
	{ id: "n45", x: 450, y: 320, type: "preparation" },
	{ id: "n46", x: 450, y: 400, type: "rtriangle" },
	{ id: "n47", x: 450, y: 480, type: "sort" },
	{ id: "n48", x: 450, y: 560, type: "star" },
	{ id: "n49", x: 450, y: 640, type: "trapezoid" },
	{ id: "n50", x: 450, y: 720, type: "square" },
	{ id: "n51", x: 0, y: 800, type: "octagon" },
	{ id: "n52", x: 150, y: 800, type: "heptagon" },
	{ id: "n53", x: 300, y: 800, type: "multidoc" },
	{ id: "n54", x: 450, y: 800, type: "note" },
];

const webix_widgets = [
	{
		id: "core",
		value: "Webix Core",
		$css: "master",
		x: 210,
		type: "org",
		y: 190,
		width: 180,
		height: 80,
	},
	{ id: "gantt", value: "Gantt", type: "org", x: 0, y: 80 },
	{ id: "pivot", value: "Pivot", type: "org", x: 125, y: 40 },
	{ id: "kanban", value: "Kanban", type: "org", x: 250, y: 0 },
	{ id: "diagram", value: "Diagram", type: "org", x: 375, y: 20 },
	{ id: "calendar", value: "Calendar", type: "org", x: 500, y: 60 },
	{ id: "fmanager", value: "File Manager", type: "org", x: 500, y: 180 },
	{
		id: "fmtext",
		value: "DocManager is based on File Manager",
		type: "text",
		x: 495,
		y: 250,
		width: 110,
		height: 64,
	},
	{ id: "dmanager", value: "Document Manager", type: "org", x: 500, y: 340 },
	{ id: "umanager", value: "User Manager", type: "org", x: 375, y: 370 },
	{ id: "chat", value: "Chat", type: "org", x: 130, y: 380 },
	{ id: "ssheet", value: "SpreadSheet", type: "org", x: 250, y: 400 },
	{ id: "query", value: "Query", type: "org", x: 0, y: 180 },
	{
		id: "querytext",
		value: "Report Manager uses Query for filtering queries",
		type: "text",
		x: 55,
		y: 250,
		width: 120,
		height: 64,
	},
	{ id: "rmanager", value: "Report Manager", type: "org", x: 0, y: 360 },
];

const widget_links = [
	{ source: "core", target: "diagram" },
	{ source: "core", target: "kanban" },
	{ source: "core", target: "calendar" },
	{ source: "core", target: "fmanager" },
	{ source: "core", target: "umanager" },
	{ source: "core", target: "ssheet" },
	{ source: "core", target: "chat" },
	{ source: "core", target: "pivot" },
	{ source: "core", target: "gantt" },
	{ source: "core", target: "query" },
	{ source: "core", target: "rmanager" },
	{ source: "fmanager", target: "fmtext" },
	{ source: "fmtext", target: "dmanager" },
	{ source: "query", target: "rmanager" },
];

const widget_custom_links = [
	{ source: "core", target: "diagram" },
	{
		source: "core",
		target: "kanban",
		$arrowCss: "batman",
		arrow: [
			"300,101",
			"298,104",
			"292,98",
			"285,100",
			"300,110",
			"315,100",
			"308,98",
			"302,104",
			"300,101",
		],
	},
	{ source: "core", target: "calendar" },
	{
		source: "core",
		target: "fmanager",
		line: ["300,230", "420,205", "500,205"],
	},
	{
		source: "core",
		target: "umanager",
		line: ["300,230", "425,350", "425,370"],
	},
	{ source: "core", target: "ssheet" },
	{ source: "core", target: "chat", line: ["300,230", "180,360", "180,380"] },
	{ source: "core", target: "pivot" },
	{ source: "core", target: "gantt" },
	{ source: "core", target: "query", line: ["300,230", "180,205", "100,205"] },
	{
		source: "core",
		target: "rmanager",
		line: ["300,230", "180,330", "70,330", "70,360"],
	},
	{ source: "fmanager", target: "fmtext", arrow: false },
	{ source: "fmtext", target: "dmanager" },
	{ source: "query", target: "rmanager" },
];

const data_shapes = [
	{ id: "start", value: "start", type: "circle", x: 0, y: 80 },
	{ id: "search", value: "seach item", type: "action", x: 120, y: 80 },
	{ id: "decision", value: "", type: "decision", x: 240, y: 80 },
	{ id: "yes", value: "found", type: "text", x: 355, y: 80, width: 60 },
	{ id: "no", value: "not found", type: "text", x: 190, y: 150, width: 80 },
	{ id: "viewItem", value: "view item", type: "action", x: 430, y: 80 },
	{
		id: "add",
		value: "add to cart",
		type: "action",
		x: 580,
		y: 80,
		backgroundColor: "#F67B72",
		lineColor: "#F67B72",
		fontColor: "#fff",
	},
	{ id: "join1", value: "", type: "join", x: 740, y: 65 },
	{ id: "viewCart", value: "view cart", type: "action", x: 810, y: 30 },
	{ id: "editCart", value: "edit cart", type: "action", x: 810, y: 130 },
	{ id: "join2", value: "", type: "join", x: 980, y: 65 },
	{ id: "viewCart2", value: "view cart", type: "action", x: 840, y: 300 },
	{ id: "payment", value: "payment", type: "action", x: 670, y: 300 },
	{ id: "order", value: "order", type: "action", x: 480, y: 300 },
	{ id: "end", value: "end", type: "dot", x: 480, y: 400, height: 60 },
];

const links_shapes = [
	{ source: "start", target: "search" },
	{ source: "search", target: "decision" },
	{ source: "decision", target: "yes" },
	{
		source: "decision",
		target: "no",
		from: "bottom",
		to: "right",
	},
	{ source: "yes", target: "viewItem" },
	{
		source: "no",
		target: "search",
		from: "left",
		to: "bottom",
	},
	{ source: "viewItem", target: "add" },
	{ source: "add", target: "join1" },
	{
		source: "join1",
		target: "viewCart",
		from: "left",
		to: "center",
		line: ["740,65", "740,80", "780,80", "780,55", "860,55"],
	},
	{
		source: "join1",
		target: "editCart",
		from: "right",
		to: "center",
		line: ["740,145", "740,130", "780,130", "780,155", "860,155"],
	},
	{
		source: "viewCart",
		target: "join2",
		from: "center",
		to: "left",
		line: ["860,55", "940,55", "940,80", "990,80", "990,65"],
	},
	{
		source: "editCart",
		target: "join2",
		from: "center",
		to: "right",
		line: ["860,155", "940,155", "940,130", "990,130", "990,145"],
	},
	{
		source: "join2",
		target: "viewCart2",
		from: "center",
		to: "right",
		line: ["990,105", "1031,105", "1031,326", "941,326"],
	},
	{ source: "viewCart2", target: "payment" },
	{ source: "payment", target: "order" },
	{ source: "order", target: "end" },
];
