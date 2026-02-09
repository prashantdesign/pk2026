import { db } from './firebase';
import { doc, setDoc, updateDoc, increment, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

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

export const trackPageView = async (pageType: 'home' | 'project', projectId?: string, projectName?: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const deviceType = isMobile ? 'mobile' : 'desktop';

    // 1. Update Daily Stats
    const dailyRef = doc(db, 'dailyStats', today);
    const dailySnap = await getDoc(dailyRef);

    if (!dailySnap.exists()) {
      await setDoc(dailyRef, {
        date: today,
        views: 1,
        mobile: isMobile ? 1 : 0,
        desktop: isMobile ? 0 : 1,
      });
    } else {
      await updateDoc(dailyRef, {
        views: increment(1),
        [deviceType]: increment(1),
      });
    }

    // 2. Update Project Stats (if applicable)
    if (pageType === 'project' && projectId && projectName) {
      const projectRef = doc(db, 'projectStats', projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        await setDoc(projectRef, {
          name: projectName,
          views: 1,
        });
      } else {
        await updateDoc(projectRef, {
          views: increment(1),
          name: projectName, // Update name just in case it changed
        });
      }
    }
  } catch (error) {
    console.error("Error tracking page view:", error);
  }
};

export const getAnalyticsData = async () => {
  try {
    // 1. Get last 7 days of daily stats
    const dailyQuery = query(collection(db, 'dailyStats'), orderBy('date', 'desc'), limit(7));
    const dailySnapshot = await getDocs(dailyQuery);
    const dailyStats: DailyStats[] = dailySnapshot.docs.map(doc => doc.data() as DailyStats).reverse();

    // 2. Get top 5 popular projects
    const projectQuery = query(collection(db, 'projectStats'), orderBy('views', 'desc'), limit(5));
    const projectSnapshot = await getDocs(projectQuery);
    const projectStats: ProjectStats[] = projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectStats));

    return { dailyStats, projectStats };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return { dailyStats: [], projectStats: [] };
  }
};
