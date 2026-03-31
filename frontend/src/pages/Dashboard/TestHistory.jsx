import React from 'react';

const TestHistory = ({ tests }) => {
  if (tests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tests taken yet</p>
      </div>
    );
  }

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-3">
      {tests.map((test, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-800 capitalize">{test.type} Test</p>
            <p className="text-xs text-gray-500">
              {new Date(test.completedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className={`font-semibold ${getAccuracyColor(test.accuracy)}`}>
              {test.accuracy?.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">
              Score: {test.score}/{test.totalQuestions}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestHistory;