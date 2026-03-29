import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Lock, CheckCircle, Circle } from 'lucide-react';

const RoadmapVisualization = ({ roadmapData, roadmapProgress, onNodeClick, currentPosition }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    // Auto-expand first section on load
    if (roadmapData?.sections?.length > 0) {
      setExpandedSections({ [roadmapData.sections[0].id]: true });
    }
  }, [roadmapData]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getNodeStatus = (topicId) => {
    if (!roadmapProgress?.topicProgress) return 'not-started';
    
    const topicProgress = roadmapProgress.topicProgress.find(
      tp => tp.topicId === topicId || tp.topicId._id === topicId
    );
    
    if (!topicProgress) return 'not-started';
    return topicProgress.isCompleted ? 'completed' : 'in-progress';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in-progress':
        return 'text-yellow-500';
      case 'current':
        return 'text-blue-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'in-progress':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'current':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  if (!roadmapData || !roadmapData.sections) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Loading roadmap visualization...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="sticky top-0 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {roadmapData.title}
        </h2>
        <p className="text-gray-600 text-sm">{roadmapData.description}</p>
        
        {/* Progress Bar */}
        {roadmapProgress && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Overall Progress</span>
              <span className="text-blue-600 font-semibold">
                {roadmapProgress.completionPercentage || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-500"
                style={{ width: `${roadmapProgress.completionPercentage || 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sections Tree */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {roadmapData.sections.map((section, sectionIdx) => {
            const isExpanded = expandedSections[section.id] !== false;
            const sectionProgress = roadmapProgress?.sectionProgress?.find(
              sp => sp.sectionId === section.id
            );

            return (
              <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-3 text-left"
                >
                  <div className="text-gray-600">
                    {isExpanded ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {section.order ? `${section.order}. ` : ''}{section.title}
                    </h3>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {section.estimatedWeeks ? `${section.estimatedWeeks} weeks` : ''}
                  </div>
                </button>

                {/* Topics */}
                {isExpanded && (
                  <div className="p-4 space-y-3 bg-white border-t border-gray-100">
                    {section.topics?.map((topic, topicIdx) => {
                      const status = getNodeStatus(topic.id || topic._id);
                      const isCurrent = currentPosition === (topic.id || topic._id);
                      const displayStatus = isCurrent ? 'current' : status;

                      return (
                        <button
                          key={topic.id || topicIdx}
                          onClick={() => {
                            setSelectedNode(topic);
                            onNodeClick?.(topic);
                          }}
                          className={`w-full p-4 border rounded-lg transition-all text-left ${getStatusBgColor(
                            displayStatus
                          )}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {displayStatus === 'completed' && (
                                <CheckCircle size={20} className="text-green-500" />
                              )}
                              {displayStatus === 'in-progress' && (
                                <Circle size={20} className="text-yellow-500 fill-yellow-500" />
                              )}
                              {displayStatus === 'current' && (
                                <Circle size={20} className="text-blue-500 fill-blue-500" />
                              )}
                              {displayStatus === 'not-started' && (
                                <Circle size={20} className="text-gray-300" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {topic.order ? `${topic.order}. ` : ''}{topic.title}
                              </h4>
                              <p className="text-sm text-gray-600 truncate">
                                {topic.description}
                              </p>
                              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                {topic.difficulty && (
                                  <span className="capitalize px-2 py-1 bg-white rounded border border-gray-200">
                                    {topic.difficulty}
                                  </span>
                                )}
                                {topic.estimatedHours && (
                                  <span className="px-2 py-1 bg-white rounded border border-gray-200">
                                    {topic.estimatedHours}h
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoadmapVisualization;
