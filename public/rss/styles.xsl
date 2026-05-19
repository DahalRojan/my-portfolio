<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/> — RSS</title>
        <style>
          :root { color-scheme: light; }
          body {
            background: #faf7f2;
            color: #1a1a1a;
            font-family: "IBM Plex Sans", system-ui, sans-serif;
            line-height: 1.55;
            max-width: 720px;
            margin: 0 auto;
            padding: 48px 24px;
            font-size: 17px;
          }
          h1 {
            font-family: "Instrument Serif", Georgia, serif;
            font-weight: 400;
            font-size: 48px;
            line-height: 1.1;
            margin: 0 0 8px;
          }
          .kicker {
            font-family: ui-monospace, "JetBrains Mono", monospace;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: #b54a2a;
            margin: 0 0 16px;
          }
          .lede { color: #4a4845; font-size: 18px; margin: 0 0 32px; }
          .lede a { color: #b54a2a; }
          ul { list-style: none; padding: 0; margin: 0; }
          li { border-top: 1px solid rgba(26,26,26,0.12); padding: 24px 0; }
          li h2 {
            font-family: "Instrument Serif", Georgia, serif;
            font-weight: 400;
            font-size: 28px;
            line-height: 1.2;
            margin: 0 0 6px;
          }
          li h2 a { color: inherit; text-decoration: none; border-bottom: 1px solid rgba(26,26,26,0.18); }
          li h2 a:hover { color: #b54a2a; border-bottom-color: #b54a2a; }
          .meta {
            font-family: ui-monospace, "JetBrains Mono", monospace;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            color: #8a8782;
            margin: 0 0 8px;
          }
          .dek { color: #4a4845; margin: 0; }
        </style>
      </head>
      <body>
        <p class="kicker">RSS feed</p>
        <h1><xsl:value-of select="/rss/channel/title"/></h1>
        <p class="lede">
          <xsl:value-of select="/rss/channel/description"/><br/><br/>
          Paste <code><xsl:value-of select="/rss/channel/link"/>rss.xml</code> into your RSS reader, or
          <a><xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>visit the site &#8594;</a>
        </p>
        <ul>
          <xsl:for-each select="/rss/channel/item">
            <li>
              <p class="meta">
                <xsl:value-of select="substring(pubDate, 0, 17)"/>
              </p>
              <h2>
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
              </h2>
              <p class="dek"><xsl:value-of select="description"/></p>
            </li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
