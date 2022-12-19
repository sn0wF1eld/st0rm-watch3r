import Document, {Head, Html, Main, NextScript} from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <title>St0rm Watch3r</title>
        </Head>
        <body>
        <Main />
        <div id="modal" />
        <NextScript />
        </body>
      </Html>
    )
  }
}
