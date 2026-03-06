'use client';

import { useFirestore } from '@/firebase';
import { doc, setDoc, updateDoc, increment, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useCallback } from 'react';

export interface DailyStats {
  date: string;
  views: number;
  mobile: number;
  desktop: number;
}

export interface ProjectStats {
  id: string;
  name: string;
  views: number;
}

export function useAnalytics() {
  const firestore = useFirestore();

  const trackPageView = useCallback(async (pageType: 'home' | 'project', projectId?: string, projectName?: string) => {
    if (!firestore) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const deviceType = isMobile ? 'mobile' : 'desktop';

      // 1. Update Daily Stats
      const dailyDocRef = doc(firestore, 'daily_stats', today);
      const dailySnap = await getDoc(dailyDocRef);

      if (!dailySnap.exists()) {
        await setDoc(dailyDocRef, {
          date: today,
          views: 1,
          mobile: isMobile ? 1 : 0,
          desktop: isMobile ? 0 : 1,
        });
      } else {
        await updateDoc(dailyDocRef, {
          views: increment(1),
          [deviceType]: increment(1),
        });
      }

      // 2. Update Project Stats (if applicable)
      if (pageType === 'project' && projectId && projectName) {
        const projectDocRef = doc(firestore, 'project_stats', projectId);
        const projectSnap = await getDoc(projectDocRef);

        if (!projectSnap.exists()) {
          await setDoc(projectDocRef, {
            name: projectName,
            views: 1,
          });
        } else {
          await updateDoc(projectDocRef, {
            views: increment(1),
            name: projectName, // Update name just in case it changed
          });
        }
      }
    } catch (error) {
      console.error("Error tracking page view:", error);
    }
  }, [firestore]);

  const getAnalyticsData = useCallback(async () => {
    if (!firestore) return { dailyStats: [], projectStats: [] };

    try {
      // 1. Get last 7 days of daily stats
      const dailyQuery = query(collection(firestore, 'daily_stats'), orderBy('date', 'desc'), limit(7));
      const dailySnapshot = await getDocs(dailyQuery);
      const dailyStats: DailyStats[] = dailySnapshot.docs.map(doc => doc.data() as DailyStats).reverse();

      // 2. Get top 5 popular projects
      const projectQuery = query(collection(firestore, 'project_stats'), orderBy('views', 'desc'), limit(5));
      const projectSnapshot = await getDocs(projectQuery);
      const projectStats: ProjectStats[] = projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectStats));

      return { dailyStats, projectStats };
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      return { dailyStats: [], projectStats: [] };
    }
  }, [firestore]);

  return { trackPageView, getAnalyticsData };
}
