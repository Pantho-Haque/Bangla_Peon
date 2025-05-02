"use client";

import { Category } from "@/contracts/posts";
import { getCategoriesAPI } from "@/lib/api/FindAPI";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const CategorySelectionOnFnd = ({
  selectedCategory,
  setSelectedCategory,
  selectedSkills,
  setSelectedSkills,
  initialCategoryId,
}: {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  initialCategoryId?: number;
}) => {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategoriesAPI,
    initialData: []
  });
  
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && categories && initialCategoryId && !selectedCategory) {
      const category = categories.find((cat: Category) => cat.id === initialCategoryId);
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [categories, initialCategoryId, isLoading, selectedCategory, setSelectedCategory]);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const categoryId = parseInt(event.target.value);
    const category = categories?.find((cat: Category) => cat.id === categoryId);
    setSelectedCategory(category || null);
    setSelectedSkills([]); // Reset skills when category changes
    setError("");
  };

  const handleSkillChange = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      if (selectedSkills.length < 5) {
        setSelectedSkills([...selectedSkills, skill]);
        setError("");
      } else {
        setError("You can select up to 5 skills only");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md sticky top-24 z-10 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6">Select Category and Skills</h2>

      <div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Category:
          </label>
          <select
            onChange={handleCategoryChange}
            value={selectedCategory?.id || ""}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select Category --</option>
            {isLoading ? (
              <option>Loading...</option>
            ) : (
              categories?.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
        </div>

        {selectedCategory && (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Skills:{" "}
              <span className="text-sm text-gray-500">(Select up to 5)</span>
            </label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {selectedCategory.skills.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`skill-${index}`}
                    checked={selectedSkills.includes(skill)}
                    onChange={() => handleSkillChange(skill)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`skill-${index}`} className="text-gray-700">
                    {skill}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        {selectedSkills.length > 0 && (
          <div className="text-sm text-gray-600">
            Selected: {selectedSkills.length}/5
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySelectionOnFnd;
