import { useEffect, useRef, useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { formatCurrency } from '../../../../utils/currency'
import { useChat } from '../hooks/useChat'
import { DishOptionModal } from '../../menu/components/DishOptionModal'
import { toast } from 'react-toastify'

export function CustomerChat({ sessionId }: { sessionId: string }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const chat = useChat(sessionId)
  const bottom = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'nearest' })
  }, [open, chat.messages, chat.pending, chat.error])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Trợ lý FoodHub"
        title="Trợ lý FoodHub"
        className="fixed bottom-24 right-4 z-30 flex size-12 items-center justify-center rounded-2xl border border-white/20 bg-brand-dark text-white shadow-lg transition-colors hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 md:bottom-6"
      >
        <Icon name="message" size={22} />
      </button>
      {open && (
        <Modal title="Trợ lý FoodHub" onClose={() => setOpen(false)}>
          <div className="flex flex-col">
            <div
              className="h-[min(48dvh,420px)] space-y-4 overflow-y-auto bg-stone-50/70 p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="log"
              aria-label="Hội thoại tư vấn món"
              aria-live="polite"
            >
              {!chat.messages.length && (
                <div className="px-2 py-6 text-center">
                  <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-mint text-brand">
                    <Icon name="spark" size={25} />
                  </span>
                  <p className="mt-4 font-semibold">Hôm nay bạn muốn ăn gì?</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {[
                      'Gợi ý món cho 2 người',
                      'Có món nào dưới 100.000đ?',
                      'Tôi muốn ăn món ít cay',
                    ].map((text) => (
                      <button
                        type="button"
                        key={text}
                        onClick={() => void chat.send(text)}
                        className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-brand hover:border-emerald-300"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chat.messages.map((message, index) => (
                <div
                  key={index}
                  className={message.role === 'user' ? 'ml-8' : 'mr-3'}
                >
                  <p
                    className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-brand text-white' : 'border border-stone-100 bg-white text-ink'}`}
                  >
                    {message.content}
                  </p>
                  {!!message.items?.length && (
                    <div className="mt-2 space-y-2">
                      {message.items.map((item) => (
                        <button
                          type="button"
                          key={item.itemId}
                          onClick={() => {
                            setOpen(false)
                            setSelected(item.itemId)
                          }}
                          className="flex w-full items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 text-left hover:border-emerald-400"
                        >
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt=""
                              loading="lazy"
                              className="size-12 rounded-lg object-cover"
                            />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block break-words text-sm font-semibold">
                              {item.itemName}
                            </span>
                            <span className="mt-1 block text-xs text-muted">
                              {item.price === null
                                ? 'Chưa có giá'
                                : formatCurrency(item.price)}
                              {!item.canOrder
                                ? ' · Hiện không khả dụng'
                                : item.requiresOptionSelection
                                  ? ' · Chọn tùy chọn'
                                  : ''}
                            </span>
                          </span>
                          <Icon name="chevron" size={16} />
                        </button>
                      ))}
                    </div>
                  )}
                  {message.searchLimited && (
                    <p className="mt-2 text-xs leading-5 text-muted">
                      Gợi ý dựa trên một phần thực đơn. Bạn có thể xem thêm
                      trong danh sách món.
                    </p>
                  )}
                </div>
              ))}
              {chat.pending && (
                <p role="status" className="text-sm text-muted">
                  Đang trả lời…
                </p>
              )}
              {chat.error && (
                <p
                  role="alert"
                  className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
                >
                  {chat.error}
                </p>
              )}
              <div ref={bottom} />
            </div>
            <form
              className="border-t border-stone-100 p-4"
              onSubmit={(event) => {
                event.preventDefault()
                void chat.send()
              }}
            >
              <div className="flex items-end gap-2 rounded-2xl border border-stone-200 bg-white p-2 focus-within:border-emerald-500">
                <textarea
                  aria-label="Câu hỏi tư vấn món"
                  placeholder="Hỏi về món ăn…"
                  value={chat.draft}
                  onChange={(event) => chat.setDraft(event.target.value)}
                  maxLength={1000}
                  rows={2}
                  disabled={chat.pending}
                  className="min-w-0 flex-1 resize-none bg-transparent p-2 text-sm outline-none"
                />
                <button
                  type="submit"
                  aria-label="Gửi câu hỏi"
                  disabled={chat.pending || !chat.draft.trim()}
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white disabled:opacity-40"
                >
                  <Icon name="arrow" size={18} />
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
      {selected && (
        <DishOptionModal
          key={sessionId + selected}
          sessionId={sessionId}
          itemId={selected}
          onClose={() => setSelected(null)}
          onAdded={() => toast.success('Đã thêm vào giỏ hàng.')}
        />
      )}
    </>
  )
}
