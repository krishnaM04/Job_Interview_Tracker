import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.examly.springapp.model.Interview;
@RestController
@RequestMapping("/api/interviews")
@CrossOrigin("*")
public class InterviewController {
    @Autowired
    private InterviewService service;

    @PostMapping
    public Interview addInterview(@RequestBody Interview interview){
        return service.addInterview(interview);
    }

    @GetMapping
    public List<Interview> getAllInterview(){
        return service.getAllInterview();
    }
}
