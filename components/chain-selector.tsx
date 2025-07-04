"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNetwork } from "@/contexts/network-context"

export function ChainSelector() {
  const [open, setOpen] = useState(false)
  const { selectedChain, setSelectedChain, availableChains } = useNetwork()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-transparent"
        >
          {selectedChain ? selectedChain.name : "Select chain..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search chains..." />
          <CommandList>
            <CommandEmpty>No chain found.</CommandEmpty>
            <CommandGroup>
              {availableChains.map((chain) => (
                <CommandItem
                  key={chain.id}
                  value={chain.id}
                  onSelect={() => {
                    setSelectedChain(chain)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedChain?.id === chain.id ? "opacity-100" : "opacity-0")} />
                  {chain.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
