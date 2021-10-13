const tasks = [];
for (let i = 1; i <= 50; i++) {
	const today = new Date();
	const start_date = 1 + Math.round(i / 3);
	const end_date = start_date + 3 + Math.round(i / 10);

	tasks.push({
		id: i,
		start_date: new Date(
			today.getFullYear(),
			today.getMonth(),
			start_date,
			12,
			0
		),
		end_date: new Date(today.getFullYear(), today.getMonth(), end_date, 7, 0),
		text: "Task " + i,
		progress: Math.round((100 * i) / 50),
		parent: 0,
	});
}

tasks[3].parent = 3;
tasks[4].parent = 3;
tasks[5].parent = 3;
tasks[6].parent = 6;
tasks[7].parent = 6;
tasks[8].parent = 6;
tasks[9].parent = 9;
tasks[10].parent = 9;
tasks[11].parent = 9;

tasks[2].type = "project";
tasks[2].end_date = tasks[11].end_date;
tasks[4].type = "milestone";

const links = [
	{ id: 1, source: 3, target: 4, type: 0 },
	{ id: 2, source: 1, target: 2, type: 2 },
	{ id: 3, source: 5, target: 6, type: 3 },
	{ id: 4, source: 8, target: 6, type: 1 },
];

function quarterStart(date) {
	date = webix.Date.copy(date);
	date.setMonth(Math.floor(date.getMonth() / 3) * 3);
	date.setDate(1);
	return date;
}
const yearScale = { unit: "year", format: "%Y" };
const quarterScale = {
	unit: "quarter",
	format: function(start, end) {
		const parser = webix.Date.dateToStr("%M");
		const qstart = quarterStart(start);
		const qend = webix.Date.add(
			webix.Date.add(qstart, 3, "month", true),
			-1,
			"day",
			true
		);
		return parser(qstart) + " - " + parser(qend);
	},
};
const monthScale = { unit: "month", format: "%F %Y" };
const weekScale = {
	unit: "week",
	format: function(start) {
		const parser = webix.Date.dateToStr("%d %M");
		const wstart = webix.Date.weekStart(start);
		const wend = webix.Date.add(
			webix.Date.add(wstart, 1, "week", true),
			-1,
			"day",
			true
		);
		return parser(wstart) + " - " + parser(wend);
	},
};
const dayScale = { unit: "day", format: "%M %d" };
const hourScale = { unit: "hour", format: "%H:00" };

const cellWidths = {
	year: 400,
	quarter: 400,
	month: 400,
	week: 200,
	day: 200,
	hour: 50,
};

const scales = [monthScale, dayScale];

const simpleScales = [{ unit: "day", step: 1, format: "%d" }];

const complexScales = [
	yearScale,
	{ unit: "month", step: 2, format: "%m %Y" },
	{ unit: "day", step: 1, format: "%d" },
];
