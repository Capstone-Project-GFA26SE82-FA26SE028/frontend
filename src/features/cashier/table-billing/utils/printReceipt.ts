export async function printReceipt(
  details: HTMLElement,
  { restaurantName, metadata, method, qrImage }: {
    restaurantName: string
    metadata: string
    method?: string
    qrImage?: string
  },
) {
  const frame = document.createElement('iframe')
  frame.title = 'Bản in hóa đơn'
  frame.style.cssText = 'position:fixed;width:0;height:0;border:0'
  frame.srcdoc = `<!doctype html><html lang="vi"><meta charset="utf-8">
<title>Bản in hóa đơn</title>
<style>
  @page { margin: 8mm; }
  body { max-width: 360px; margin: auto; font: 13px Arial, sans-serif; }
  header, figure { text-align: center; overflow-wrap: anywhere; }
  header { margin-bottom: 16px; }
  h1 { margin: 0 0 12px; font-size: 19px; text-transform: uppercase; }
  h2 { margin: 0 0 8px; font-size: 15px; font-weight: 600; text-transform: uppercase; }
  header p { margin: 0; color: #475569; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 7px 4px; border-bottom: 1px solid #ccc; }
  th:first-child { text-align: left; }
  td:nth-child(2) { text-align: center; }
  th:last-child, td:last-child { text-align: right; white-space: nowrap; }
  td p { margin: 2px 0; }
  [data-receipt-hide] { display: none; }
  dl div { display: flex; justify-content: space-between; gap: 12px; margin: 8px 0; }
  dd { margin: 0; }
  dl div:last-child { font-weight: bold; }
  figure { margin: 14px 0 0; break-inside: avoid; }
  img { display: block; width: 44mm; max-width: 100%; margin: 6px auto 0; }
</style><body></body></html>`
  const receiptSections = [...details.querySelectorAll('[data-receipt]')]
    .map((element) => element.cloneNode(true))

  try {
    await new Promise<void>((resolve, reject) => {
      frame.onload = () => resolve()
      frame.onerror = () => reject(new Error('Không thể mở bản in.'))
      document.body.append(frame)
    })
    const printWindow = frame.contentWindow
    if (!printWindow) throw new Error('Không thể mở bản in.')

    const doc = printWindow.document
    const header = doc.createElement('header')
    const name = doc.createElement('h1')
    name.textContent = restaurantName
    const title = doc.createElement('h2')
    title.textContent = method ? 'Phiếu thanh toán' : 'Hóa đơn thanh toán'
    const reference = doc.createElement('p')
    reference.textContent = metadata
    header.append(name, title, reference)
    doc.body.append(header, ...receiptSections)

    if (method) {
      const payment = doc.createElement('figure')
      const label = doc.createElement('figcaption')
      label.textContent = method
      payment.append(label)
      doc.body.append(payment)
      if (qrImage) {
        const image = doc.createElement('img')
        image.alt = 'Mã VietQR thanh toán'
        image.src = qrImage
        payment.append(image)
        await image.decode()
      }
    }

    printWindow.onafterprint = () => frame.remove()
    printWindow.focus()
    printWindow.print()
  } catch (error) {
    frame.remove()
    throw error
  }
}
