
export default function Loading() {
    return (
        <div className="container py-8">
            {/* Skeleton for Sports List */}
            <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-10 w-32 bg-zinc-800 rounded-full animate-pulse flex-shrink-0" />
                ))}
            </div>

            {/* Skeleton for Live Section */}
            <div className="mb-12">
                <div className="h-8 w-48 bg-zinc-800 rounded mb-6 animate-pulse" />
                <div className="flex gap-4 overflow-hidden">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-[280px] h-[200px] bg-zinc-800 rounded-xl animate-pulse flex-shrink-0" />
                    ))}
                </div>
            </div>

            {/* Skeleton for Upcoming Section */}
            <div>
                <div className="h-8 w-48 bg-zinc-800 rounded mb-6 animate-pulse" />
                <div className="flex gap-4 overflow-hidden">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-[280px] h-[200px] bg-zinc-800 rounded-xl animate-pulse flex-shrink-0" />
                    ))}
                </div>
            </div>
        </div>
    );
}
