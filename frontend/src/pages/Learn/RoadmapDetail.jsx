import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Download, ExternalLink, CheckCircle, Circle } from 'lucide-react';

const RoadmapDetail = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState({});

  useEffect(() => {
    fetchRoadmapData();
  }, [id]);

  const fetchRoadmapData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/roadmap/${id}`);
      setRoadmap(res.data);

      // Fetch user's progress
      try {
        const progressRes = await api.get('/roadmap/user/progress');
        const userRoadmap = progressRes.data.find(r => r.roadmapId === id);
        setUserProgress(userRoadmap || { status: 'not_started' });
      } catch (e) {
        console.log('No progress yet');
      }
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const toggleNodeExpand = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const updateProgress = async (status) => {
    try {
      await api.post('/roadmap/progress', {
        roadmapId: id,
        status
      });
      setUserProgress({ ...userProgress, status });
      toast.success('Progress updated!');
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const downloadRoadmap = async () => {
    try {
      const response = await api.get(`/roadmap/download/${id}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${roadmap.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
      toast.success('Roadmap downloaded!');
    } catch (error) {
      toast.error('Failed to download roadmap');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Loading roadmap...</div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">Roadmap not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{roadmap.title}</h1>
              <p className="text-gray-600 mt-2">{roadmap.description}</p>
            </div>
            <button
              onClick={downloadRoadmap}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {roadmap.category}
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              Level: {roadmap.level}
            </span>
            {roadmap.totalEstimatedTime && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ⏱️ {roadmap.totalEstimatedTime}
              </span>
            )}
          </div>

          {/* Progress Status */}
          <div className="mt-6 border-t pt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Your Progress</p>
            <div className="flex gap-2">
              <button
                onClick={() => updateProgress('not_started')}
                className={`px-4 py-2 rounded-lg transition ${
                  userProgress?.status === 'not_started'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Not Started
              </button>
              <button
                onClick={() => updateProgress('in_progress')}
                className={`px-4 py-2 rounded-lg transition ${
                  userProgress?.status === 'in_progress'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => updateProgress('completed')}
                className={`px-4 py-2 rounded-lg transition ${
                  userProgress?.status === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Roadmap Nodes */}
        <div className="space-y-4">
          {roadmap.nodes.map((node, index) => (
            <div key={node._id || index} className="bg-white rounded-lg shadow overflow-hidden">
              <div
                onClick={() => toggleNodeExpand(node._id || index)}
                className="p-6 cursor-pointer hover:bg-gray-50 transition flex items-start gap-4"
              >
                <div className="mt-1">
                  {expandedNodes[node._id || index] ? (
                    <CheckCircle className="text-green-600" size={24} />
                  ) : (
                    <Circle className="text-gray-400" size={24} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{node.title}</h3>
                  {node.description && (
                    <p className="text-gray-600 mt-1">{node.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {node.level}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      ⏱️ {node.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedNodes[node._id || index] && (
                <div className="px-6 pb-6 border-t">
                  {/* Skills */}
                  {node.skills && node.skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Skills to Learn</h4>
                      <div className="flex flex-wrap gap-2">
                        {node.skills.map((skill, i) => (
                          <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos */}
                  {node.videos && node.videos.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Videos</h4>
                      <div className="space-y-2">
                        {node.videos.map((video, i) => (
                          <a
                            key={i}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-red-50 hover:bg-red-100 rounded transition"
                          >
                            <span className="flex-1">
                              <p className="font-medium text-gray-900">{video.title}</p>
                              {video.duration && (
                                <p className="text-sm text-gray-600">{video.duration}</p>
                              )}
                            </span>
                            <ExternalLink size={20} className="text-red-600" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {node.resources && node.resources.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Resources</h4>
                      <div className="space-y-2">
                        {node.resources.map((resource, i) => (
                          <a
                            key={i}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded transition"
                          >
                            <span className="flex-1">
                              <p className="font-medium text-gray-900">{resource.title}</p>
                              <p className="text-xs text-gray-600 capitalize">{resource.type}</p>
                            </span>
                            <ExternalLink size={20} className="text-purple-600" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetail;