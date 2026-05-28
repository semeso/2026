---
layout: page-fullwidth
title: 'Minicursos'
meta_title: 'SEMESO 2026'
subheadline: 'SEMESO 2026 - 06 a 08/10 - UDESC Alto Vale'
teaser: 'Clique nos cards abaixo para acessar nossos minicursos!'
permalink: '/minicursos/'
---

{% for minicurso in site.minicursos %}
{% include _minicurso.html minicurso=minicurso %}
{% endfor %}
