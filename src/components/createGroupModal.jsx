import { useState } from 'react';
import { X } from 'lucide-react';

const CreateGroupModal = ({ isOpen, onClose, users, onCreateGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateGroup({ name: groupName, members: selectedMembers });
    setGroupName('');
    setSelectedMembers([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Create New Group</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Group Name"
            className="input input-bordered w-full mb-4"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
          <div className="mb-4">
            <label className="font-medium mb-2 block">Select Members</label>
            <div className="max-h-48 overflow-y-auto">
              {users.map(user => (
                <label key={user._id} className="flex items-center gap-2 p-2 hover:bg-base-200">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => {
                      setSelectedMembers(prev =>
                        prev.includes(user._id)
                          ? prev.filter(id => id !== user._id)
                          : [...prev, user._id]
                      );
                    }}
                  />
                  <span>{user.fullName}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full">Create Group</button>
        </form>
      </div>
    </div>
  );
};