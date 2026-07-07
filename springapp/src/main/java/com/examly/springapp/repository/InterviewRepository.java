package.com.examly.springapp.repository;
import org.springframework.data.jpa.repository.jpaRepository;
import org.springframework.stereotype.Repository;
import com.example.interviewtracker.model.Interview;

@Repository
public interface InterviewRepository extends jpaRepository<Interview,Long>{
}