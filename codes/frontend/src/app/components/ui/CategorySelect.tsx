import { useState, useRef, useEffect } from 'react';
import { Listbox } from '@headlessui/react';

interface Category {
    id: number;
    name: string;
    color: string;
}

interface CategorySelectProps {
    categories: Category[];
    selectedCategory: number | null;
    onSelect: (categoryId: number) => void;
}

export function CategorySelect({ categories, selectedCategory, onSelect }: CategorySelectProps) {
    const selected = categories.find(c => c.id === selectedCategory) || categories[0];

    return (
        <Listbox value={selectedCategory} onChange={onSelect}>
            <div className="relative mt-1">
                <Listbox.Button 
                    className="relative w-full cursor-pointer bg-background border rounded-lg px-6 py-2.5 pr-10 text-left focus:outline-none text-sm"
                    style={{ borderColor: '#8B4513' }}>
                    <span className="flex items-center">
                        <span 
                            className="inline-block w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: selected?.color || '#F5F5F5' }}
                        />
                        <span className="block truncate">{selected?.name.replace("_", " ")}</span>
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg className="w-5 h-5 text-[#8B4513]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">

                    {categories.map((category) => (
                        <Listbox.Option
                            key={category.id}
                            value={category.id}
                            className={({ active }) =>
                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-gray-100' : 'text-black'
                                }`
                            }
                        >
                            {({ selected, active }) => (
                                <>
                                    <span className="flex items-center">
                                        <span 
                                            className="inline-block w-3 h-3 rounded-full mr-2"
                                            style={{ backgroundColor: category.color }}
                                        />
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {category.name.replace("_", " ")}
                                        </span>
                                    </span>
                                    {selected && (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    )}
                                </>
                            )}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </div>
        </Listbox>
    );
}
