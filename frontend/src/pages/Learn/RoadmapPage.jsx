import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, BookOpen, Video, Download } from 'lucide-react';
import RoadmapVisualization from '../../components/RoadmapVisualization';

const RoadmapPage = () => {
  const { roadmapId } = useParams();
  const navigate = useNavigate();
  
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapProgress, setRoadmapProgress] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoadmap();
    fetchRoadmapProgress();
  }, [roadmapId]);

  const fetchRoadmap = async () => {
    try {
      const response = await fetch(`/api/roadmap/${roadmapId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch roadmap');
      const data = await response.json();
      setRoadmap(data);
      
      // Set first topic as selected
      if (data.sections?.[0]?.topics?.[0]) {
        setSelectedNode(data.sections[0].topics[0]);
      }
    } catch (err) {
      console.error('Error fetching roadmap:', err);
      setError('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoadmapProgress = async () => {
    try {
      const response = await fetch(`/api/roadmap/${roadmapId}/progress`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRoadmapProgress(data);
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || 'Roadmap not found'}</p>
          <button
            onClick={() => navigate('/learn')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Learn
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/learn')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft size={20} />
            Back to Learn
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{roadmap.title}</h1>
          {roadmapProgress && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold text-blue-600">
                  {roadmapProgress.completionPercentage || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-500"
                  style={{
                    width: `${roadmapProgress.completionPercentage || 0}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Visualization - Left Side */}
          <div className="lg:col-span-2">
            <RoadmapVisualization
              roadmapData={roadmap}
              roadmapProgress={roadmapProgress}
              onNodeClick={handleNodeClick}
              currentPosition={selectedNode?.id}
            />
          </div>

          {/* Details Panel - Right Side */}
          <div className="lg:col-span-1">
            {selectedNode ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm sticky top-24">
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedNode.title}
                      </h3>
                      {selectedNode.difficulty && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
                          {selectedNode.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{selectedNode.description}</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                    {selectedNode.estimatedHours && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          Estimated Duration
                        </h4>
                        <p className="text-gray-600">{selectedNode.estimatedHours} hours</p>
                      </div>
                    )}

                    {selectedNode.subtopics && selectedNode.subtopics.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Topics Covered
                        </h4>
                        <ul className="space-y-1">
                          {selectedNode.subtopics.map((subtopic, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-600 flex items-center gap-2"
                            >
                              <span className="text-blue-500">•</span>
                              {subtopic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedNode.prerequisites && selectedNode.prerequisites.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Prerequisites
                        </h4>
                        <ul className="space-y-1">
                          {selectedNode.prerequisites.map((prereq, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-600 flex items-center gap-2"
                            >
                              <span className="text-amber-500">→</span>
                              {prereq}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Resources */}
                  <div className="space-y-3">
                    {selectedNode.resources && selectedNode.resources.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Resources
                        </h4>
                        <div className="space-y-2">
                          {selectedNode.resources.map((resource, idx) => (
                            <a
                              key={idx}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700 hover:text-blue-600"
                            >
                              {resource.type === 'video' ? (
                                <Video size={16} />
                              ) : (
                                <BookOpen size={16} />
                              )}
                              <span className="truncate">{resource.title}</span>
                              <ExternalLink size={14} className="ml-auto flex-shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedNode.practicalProjects && selectedNode.practicalProjects.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Practical Projects
                        </h4>
                        <ul className="space-y-2">
                          {selectedNode.practicalProjects.map((project, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-600 flex items-start gap-2 p-2 rounded bg-gray-50"
                            >
                              <span className="text-green-500 font-bold mt-0.5">✓</span>
                              {project}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Start Button */}
                  <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Video size={18} />
                    Start Learning
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
                Select a topic to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
