/*
	Wilson's Grove HOA
	Builds the header and footer on every page, so the menu lives in one place.
	To add, rename or remove a menu item, edit NAV below.
*/

const PORTAL_URL = 'https://portal.dhbader.com/login';
const CELLBADGE_URL = 'https://cellbadge.com/wilsonsgrove/';
const FACEBOOK_URL = 'https://www.facebook.com/groups/1386216171690292/';
const ANALYTICS_ID = 'G-Y09NK2MRZ4';

const NAV = [
	{ label: 'News', href: 'news.html' },
	{ label: 'Amenities', href: 'amenities.html' },
	{
		label: 'Committees',
		children: [
			{ label: 'Pool', href: 'pool_committee.html' },
			{ label: 'ARC', href: 'arc_committee.html' },
			{ label: 'Events', href: 'events_committee.html' }
		]
	},
	{ label: 'Projects', href: 'community_projects.html' },
	{ label: 'Documents', href: 'documents.html' },
	{ label: 'FAQ', href: 'faq.html' },
	{ label: 'Calendar', href: 'calendar.html' },
	{ label: 'Contact', href: 'contact_us.html' }
];

const currentPage = location.pathname.split('/').pop() || 'index.html';

function navLink(item) {
	const current = item.href === currentPage ? ' aria-current="page"' : '';
	return '<a href="' + item.href + '"' + current + '>' + item.label + '</a>';
}

function buildHeader() {
	const header = document.getElementById('site-header');
	if (!header) return;

	const items = NAV.map(function (item) {
		if (!item.children) return '<li>' + navLink(item) + '</li>';
		const open = item.children.some(function (c) { return c.href === currentPage; });
		return '<li><details' + (open && window.innerWidth < 1216 ? ' open' : '') + '><summary>' + item.label + '</summary><ul>' +
			item.children.map(function (c) { return '<li>' + navLink(c) + '</li>'; }).join('') +
			'</ul></details></li>';
	}).join('');

	header.innerHTML =
		'<div class="wrap">' +
			'<a class="brand" href="index.html">' +
				'<svg viewBox="0 0 64 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">' +
					'<path d="M2 30h60M10 30V11M21 30V17M32 30V8M43 30V17M54 30V11"/>' +
					'<circle cx="10" cy="11" r="6"/><circle cx="21" cy="17" r="4"/><circle cx="32" cy="8" r="7"/><circle cx="43" cy="17" r="4"/><circle cx="54" cy="11" r="6"/>' +
				'</svg>' +
				'<span>Wilson\'s Grove</span>' +
			'</a>' +
			'<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>' +
			'<nav class="nav" id="site-nav" aria-label="Main">' +
				'<ul>' + items +
					'<li class="nav-portal">' + navLink({ label: 'Homeowner Portal', href: 'member_portal.html' }) + '</li>' +
				'</ul>' +
			'</nav>' +
		'</div>';

	const toggle = header.querySelector('.nav-toggle');
	const nav = header.querySelector('.nav');
	toggle.addEventListener('click', function () {
		const open = nav.classList.toggle('open');
		toggle.setAttribute('aria-expanded', open);
		toggle.textContent = open ? 'Close' : 'Menu';
	});

	// Close the Committees dropdown when clicking elsewhere or pressing Escape
	const drop = header.querySelector('details');
	document.addEventListener('click', function (e) {
		if (drop.open && !drop.contains(e.target) && !nav.classList.contains('open')) drop.open = false;
	});
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') drop.open = false;
	});
}

function buildFooter() {
	const footer = document.getElementById('site-footer');
	if (!footer) return;

	footer.innerHTML =
		'<div class="wrap">' +
			'<div class="footer-grid">' +
				'<div>' +
					'<p class="footer-brand">Wilson\'s Grove</p>' +
					'<p>Homeowners Association, Inc.<br>807 Sebastian Lane<br>Gambrills, MD 21054</p>' +
					'<p><a href="mailto:wilsonsgroveboard@gmail.com">wilsonsgroveboard@gmail.com</a></p>' +
				'</div>' +
				'<div>' +
					'<h2>For Homeowners</h2>' +
					'<ul>' +
						'<li><a href="' + PORTAL_URL + '" target="_blank" rel="noopener">D.H. Bader portal</a></li>' +
						'<li><a href="' + CELLBADGE_URL + '" target="_blank" rel="noopener">CellBadge pool registration</a></li>' +
						'<li><a href="' + FACEBOOK_URL + '" target="_blank" rel="noopener">Facebook group</a></li>' +
					'</ul>' +
				'</div>' +
				'<div>' +
					'<h2>On This Site</h2>' +
					'<ul>' +
						'<li><a href="documents.html">Documents library</a></li>' +
						'<li><a href="faq.html">FAQ</a></li>' +
						'<li><a href="calendar.html">Events calendar</a></li>' +
						'<li><a href="contact_us.html">Contact us</a></li>' +
					'</ul>' +
				'</div>' +
			'</div>' +
			'<div class="footer-legal">' +
				'<p>&copy; ' + new Date().getFullYear() + ' Wilson\'s Grove Homeowners Association, Inc.</p>' +
				'<p><a href="terms_of_use.html">Terms and Conditions of Website Use</a></p>' +
			'</div>' +
		'</div>';
}

// On phones each table row becomes a card; label the cells from the column headings
function labelTableCells() {
	document.querySelectorAll('table').forEach(function (table) {
		const heads = Array.from(table.querySelectorAll('thead th')).map(function (th) { return th.textContent.trim(); });
		table.querySelectorAll('tbody tr').forEach(function (row) {
			Array.from(row.children).forEach(function (cell, i) {
				if (heads[i]) cell.setAttribute('data-label', heads[i]);
			});
		});
	});
}

// Tables marked data-tracker get a count and a "Hide completed" checkbox
function buildTrackers() {
	document.querySelectorAll('table[data-tracker]').forEach(function (table) {
		const rows = table.querySelectorAll('tbody tr');
		const done = table.querySelectorAll('tbody tr.done').length;
		const open = rows.length - done;
		const bar = document.createElement('div');
		bar.className = 'tracker-bar';
		bar.innerHTML = '<span>' + open + ' open, ' + done + ' complete</span>' +
			'<label><input type="checkbox">Hide completed</label>';
		bar.querySelector('input').addEventListener('change', function (e) {
			table.classList.toggle('hide-done', e.target.checked);
		});
		const wrap = table.closest('.table-wrap') || table;
		wrap.parentNode.insertBefore(bar, wrap);
	});
}

// <input data-filter="CSS selector of items" data-empty="#id of no-match message">
function buildFilters() {
	document.querySelectorAll('input[data-filter]').forEach(function (input) {
		const items = Array.from(document.querySelectorAll(input.dataset.filter));
		const empty = input.dataset.empty ? document.querySelector(input.dataset.empty) : null;
		input.addEventListener('input', function () {
			const q = input.value.trim().toLowerCase();
			let shown = 0;
			items.forEach(function (el) {
				const hit = !q || el.textContent.toLowerCase().includes(q);
				el.hidden = !hit;
				if (hit) shown++;
			});
			document.querySelectorAll('[data-filter-group]').forEach(function (group) {
				group.hidden = !items.some(function (el) { return group.contains(el) && !el.hidden; });
			});
			if (empty) empty.hidden = shown > 0;
		});
	});
}

// Links straight to a FAQ question (faq.html#q-...) open that question
function openLinkedQuestion() {
	const target = location.hash && document.getElementById(location.hash.slice(1));
	if (target && target.tagName === 'DETAILS') target.open = true;
}

function loadAnalytics() {
	if (location.protocol === 'file:') return;
	const s = document.createElement('script');
	s.async = true;
	s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ANALYTICS_ID;
	document.head.appendChild(s);
	window.dataLayer = window.dataLayer || [];
	window.gtag = function () { dataLayer.push(arguments); };
	gtag('js', new Date());
	gtag('config', ANALYTICS_ID);
}

buildHeader();
buildFooter();
labelTableCells();
buildTrackers();
buildFilters();
openLinkedQuestion();
window.addEventListener('hashchange', openLinkedQuestion);
loadAnalytics();
