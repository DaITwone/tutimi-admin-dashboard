"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function DashboardAIButton({ onClick }: { onClick: () => void }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-20 w-20 rounded-full"
                        onClick={onClick}
                    >
                        <Image
                            src={"/images/whale.png"}
                            alt="TUTIMI AI"
                            width={80}
                            height={80}
                        />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>TUTIMI Assistant</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}