import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface TimelineEvent {
    id: string;
    title: string;
    date: string;
    description: string;
    icon: string;
    location: string;
    status: 'completed' | 'current' | 'pending';
    details?: { label: string; value: string }[];
}

interface ProductJourneyTimelineProps {
    events: TimelineEvent[];
}

export default function ProductJourneyTimeline({ events }: ProductJourneyTimelineProps) {
    return (
        <div className="relative py-10 px-4 md:px-0">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-stone-200 transform -translate-x-1/2" />

            <div className="space-y-12">
                {events.map((event, index) => {
                    const isEven = index % 2 === 0;
                    const isCompleted = event.status === 'completed';
                    const isCurrent = event.status === 'current';

                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className={cn(
                                "relative flex items-center md:justify-between",
                                isEven ? "flex-row" : "flex-row-reverse"
                            )}
                        >
                            {/* Content Card */}
                            <div className={cn(
                                "w-full md:w-[45%] pl-20 md:pl-0",
                                isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
                            )}>
                                <div className={cn(
                                    "bg-white p-6 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md",
                                    isCurrent ? "border-emerald-500 ring-1 ring-emerald-500" : "border-stone-100"
                                )}>
                                    <div className={cn(
                                        "flex items-center gap-2 mb-2",
                                        isEven ? "md:justify-end" : "md:justify-start"
                                    )}>
                                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                            {event.date}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-stone-900 mb-1">{event.title}</h3>
                                    <p className="text-stone-500 text-sm mb-4 flex items-center gap-1 justify-start md:justify-inherit">
                                        <span className="text-stone-400">📍</span> {event.location}
                                    </p>
                                    <p className="text-stone-600 mb-4">{event.description}</p>

                                    {event.details && (
                                        <div className={cn(
                                            "grid grid-cols-2 gap-4 pt-4 border-t border-stone-100",
                                            isEven ? "md:justify-items-end" : "md:justify-items-start"
                                        )}>
                                            {event.details.map((detail, i) => (
                                                <div key={i}>
                                                    <p className="text-xs text-stone-400 uppercase">{detail.label}</p>
                                                    <p className="font-medium text-stone-800">{detail.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Center Node */}
                            <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.2 + 0.2 }}
                                    className={cn(
                                        "w-12 h-12 rounded-full border-4 flex items-center justify-center z-10 bg-white",
                                        isCompleted ? "border-emerald-500 text-emerald-600" :
                                            isCurrent ? "border-emerald-500 text-emerald-600 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" :
                                                "border-stone-200 text-stone-300"
                                    )}
                                >
                                    <span className="text-xl">{event.icon}</span>
                                </motion.div>
                            </div>

                            {/* Spacer for the other side */}
                            <div className="hidden md:block w-[45%]" />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
