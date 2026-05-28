---
layout: page-fullwidth
title: 'Palestras e Painéis'
meta_title: 'SEMESO 2026'
subheadline: 'SEMESO 2026 - 06 a 08/10 - UDESC Alto Vale'
teaser: 'XIII Seminário de Engenharia de Software'
teaser: 'Clique nos cards abaixo para expandir o conteúdo das nossas palestras e painéis'
permalink: '/palestras/'
---

{% for palestra in site.palestras %}
{% include _palestra.html palestra=palestra %}
{% endfor %}
