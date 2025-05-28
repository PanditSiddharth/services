"use client"
import { getProvidersNetwork } from '@/app/actions/referral';
import OrgChart from '@balkangraph/orgchart.js';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function HomePage() {
  const { data: session } = useSession();
  const [chartData, setChartData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Moved API call to parent component
  useEffect(() => {
    if (!session?.user?._id) return;
    
    // Fetch data only once when component mounts
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getProvidersNetwork(session.user._id);
        if (res?.data) {
          const formattedData = res.data.map(provider => ({
            id: provider.id,
            pid: provider?.pid,
            name: provider?.name,
            title: `Level ${provider?.level || 0} || Downline ${provider?.totalReferrals || 0} `,
            img: provider.img,
            level: provider.level || 0,
            totalReferrals: provider?.totalReferrals || 0,
            joinDate: provider.joinDate
          }));
          setChartData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching providers network:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session?.user?._id]); // Only depend on user ID

  function Orgchart(props) {
    const divRef = useRef<HTMLDivElement>(null);
    const [chart, setChart] = useState<any>(null);
    
    useEffect(() => {
      if (divRef.current) {
        const newChart = new OrgChart(divRef.current, {
          template: "diva",
          enableSearch: false,
          nodeBinding: props.nodeBinding,
          nodes: props.nodes,
          layout: OrgChart.tree,
          orientation: OrgChart.orientation.top,
          mouseScrool: OrgChart.action.zoom,
          levelSeparation: 100,
          siblingSeparation: 40,
          subtreeSeparation: 80,
          padding: 30,
          // miniMap: true,
          collapse: {
            level: 6,
            allChildren: true
          },
          // nodeMenu: null,
        });
        setChart(newChart);
      }

      // Cleanup function
      return () => {
        if (chart) {
          chart.destroy();
        }
      };
    }, [props.nodes, props.nodeBinding]);
    
    return (
      <div 
        ref={divRef} 
        style={{ 
          height: "90vh",
          width: "100%",
          marginTop: "4px",
          border: "1px solid #eee",
          borderRadius: "5px",
          backgroundColor: "#bfffbf",
        }}
      />
    );
  }

  const nodeBinding = {
    field_0: "name",
    img_0: "img",
    field_1: "title",
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] bg-gradient-to-r from-green-50 to-green-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Loading Network Tree
          </h3>
          <p className="text-sm text-gray-500">
            Please wait while we fetch your network data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Link
        href="/service-provider/referral"
        className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-300 rounded-md hover:bg-green-400 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
      <Orgchart 
        nodes={chartData}
        nodeBinding={nodeBinding} 
      />
    </div>
  )
}