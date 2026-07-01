import { listEntriesEndpoint } from "@/api/entry/list.js"
import type { Entry } from "@/interfaces/entry/entry.js"
import { each, Props, state, Suspense, variants } from "@jsxrx/core"
import { ResolvedProps } from "@jsxrx/router"
import { map, Observable } from "rxjs"
import List from "../ui/list/List.js"
import ListItem from "../ui/list/ListItem.js"
import Skeleton from "../ui/Skeleton.js"
import { shallowComparator } from "@jsxrx/utils"

type EntryListProps = Readonly<{
  entries: Entry[]
  isLoading?: boolean
}>

export function EntryListResolver(): ResolvedProps<EntryListProps> {
  const now = new Date()
  const to = now.toISOString()
  const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const fetchResult$ = listEntriesEndpoint.fetch(state({ from, to }))

  return {
    entries: fetchResult$.pipe(map(result => result.entries)),
  }
}

export default function EntryList(props$: Observable<EntryListProps>) {
  const { entries$, isLoading$ } = Props.take(props$, {
    isLoading: false,
  })

  const skeleton = (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <ListItem key={i}>
          <Skeleton className="h-6 w-full" />
        </ListItem>
      ))}
    </>
  )

  return (
    <>
      <List>
        <Suspense suspended={isLoading$} fallback={skeleton}>
          {entries$.pipe(
            each(
              entry$ => (
                <ListItem>
                  <div className="flex items-center justify-between w-full gap-4">
                    <span>
                      {entry$.pipe(
                        map(entry => new Date(entry.date).toLocaleDateString()),
                      )}
                    </span>
                    <span
                      className={variants(
                        entry$.pipe(map(entry => entry.mode)),
                        {
                          now: "rounded-full px-2 py-0.5 text-xs bg-green-100 text-green-800",
                          manual:
                            "rounded-full px-2 py-0.5 text-xs bg-amber-100 text-amber-800",
                        },
                      )}
                    >
                      {entry$.pipe(
                        map(entry => (entry.mode === "now" ? "Now" : "Manual")),
                      )}
                    </span>
                    <span className="font-mono text-xs text-neutral-500">
                      {entry$.pipe(map(entry => entry.id.slice(0, 8)))}
                    </span>
                  </div>
                </ListItem>
              ),
              {
                trackBy: entry => entry.id,
                distinct: shallowComparator,
                whenEmpty: (
                  <p className="text-center text-neutral-500 py-8">
                    No entries found
                  </p>
                ),
              },
            ),
          )}
        </Suspense>
      </List>
    </>
  )
}
