---
layout: page-fullwidth
title: 'Programação'
meta_title: 'SEMESO 2026'
subheadline: 'SEMESO 2026 - 06 a 08/10 - UDESC Alto Vale'
teaser: 'XIII Seminário de Engenharia de Software'
header:
    #image_fullwidth: 'banner-semeso-25.png'
permalink: '/programacao/'
---

{% assign dias = site.programacao | sort: 'id' %}
{% for dia in dias %}
{% include _programacao.html dia=dia %}
{% endfor %}
