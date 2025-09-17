import React from 'react';
import StudyBlockCard from './StudyBlockCard';

const StudyBlockList = ({ studyBlocks, onDeleteBlock }) => {
  const upcomingBlocks = studyBlocks.filter(block => {
    const blockDateTime = new Date(`${block.date}T${block.startTime}`);
    return blockDateTime > new Date();
  }).sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`));

  const pastBlocks = studyBlocks.filter(block => {
    const blockDateTime = new Date(`${block.date}T${block.startTime}`);
    return blockDateTime <= new Date();
  }).sort((a, b) => new Date(`${b.date}T${b.startTime}`) - new Date(`${a.date}T${a.startTime}`));

  return (
    <div className="space-y-8">
      {/* Upcoming Sessions */}
      {upcomingBlocks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
          <div className="space-y-4">
            {upcomingBlocks.map(block => (
              <StudyBlockCard
                key={block.id}
                block={block}
                onDelete={onDeleteBlock}
              />
            ))}
          </div>
        </div>
      )}

      {/* Past Sessions */}
      {pastBlocks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Sessions</h2>
          <div className="space-y-4">
            {pastBlocks.map(block => (
              <StudyBlockCard
                key={block.id}
                block={block}
                onDelete={onDeleteBlock}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyBlockList;