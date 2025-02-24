

"use client";
import React, { useState, useEffect } from "react";
import { ChangeEvent } from "react";
import { UserIcon } from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

interface User {
  _id: string;
  owner: string;
  user: string;
  isImportant: boolean;
}

export function PersonalInfoForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedInterval, setSelectedInterval] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      fetch(`/api/settings?search=${searchTerm}`)
        .then((response) => response.json())
        .then((data) => setUsers(data.data))
        .catch((error) => console.error("Error fetching users:", error));
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);
    setIsImportant(user.isImportant || false);
    try {
      const response = await fetch(
        `/api/settings/get-user-interval?owner=${encodeURIComponent(user.owner)}`,
      );
      const data = await response.json();
      setSelectedInterval(data.interval || "");
    } catch (error) {
      console.error("Error fetching interval:", error);
    }
  };

  const handleIntervalChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedInterval(event.target.value);
  };

  const handleImportantChange = async () => {
    const updatedImportant = !isImportant;
    setIsImportant(updatedImportant);

    try {
      const response = await fetch('/api/settings/update-user-important', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: selectedUser?.owner,
          isImportant: updatedImportant,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error updating important status: ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating important status:', error);
    }
  };

  const handleSave = () => {
    if (selectedUser && selectedInterval) {
      fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: selectedUser.owner,
          interval: selectedInterval,
          isImportant: isImportant,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
          return response.json();
        })
        .then(() => {
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
        })
        .catch((error) => {
          console.error("Error saving data:", error);
          alert("Failed to save: " + error.message);
        });
    } else {
      alert("Please select a user and an interval.");
    }
  };

  return (
    <ShowcaseSection title="Personal Information" className="!p-7">
      <form>
        <InputGroup
          className="mb-5.5"
          type="text"
          name="search"
          label="Search User"
          placeholder="Search User..."
          value={searchTerm}
          handleChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          icon={<UserIcon />}
          iconPosition="left"
          height="sm"
        />

        {users.length > 0 && (
          <div className="user-list-container">
            <ul className="user-list">
              {users.map((user) => (
                <li
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className="cursor-pointer rounded p-2 hover:bg-gray-200"
                >
                  {user.owner}
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedUser && (
          <div className="user-card">
            <h3>{selectedUser.owner}</h3>
            <select
              value={selectedInterval}
              onChange={handleIntervalChange}
              className="days-dropdown"
            >
              <option value="" disabled>
                Select Interval
              </option>
              {[...Array(30)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1} Day{index > 0 ? "s" : ""}
                </option>
              ))}
            </select>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={handleImportantChange}
                />
                Important
              </label>
            </div>
            <div className="relative flex items-center justify-center rounded-lg p-4 shadow-lg">
              <button 
                type="button" 
                onClick={handleSave} 
                className="block bg-black text-white font-bold py-2 px-4 rounded mt-4"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {showSuccessMessage && (
          <div className="success-popup show">Data saved successfully!</div>
        )}
      </form>
    </ShowcaseSection>
  );
}